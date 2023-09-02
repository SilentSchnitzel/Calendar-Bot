const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const timezoneSchema = require('../models/timezone-schema.js');
const dailyReminderSchema = require('../models/daily-reminder-schema.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('config-timezone')
        .setDescription('Use this command to configurate your timezone')
        .addStringOption(time =>
            time.setName('time')
                .setDescription('Enter in local time(whatever time your computer or phone displays) in military time')
                .setRequired(true)),
    async execute(interaction) {
        //This command will calculate the timezone offset / timezone of the user when they enter in local time
        const userId = interaction.user.id;
        const guildId = interaction.guildId;

        // get utc time
        const now = new Date();
        const year = now.getUTCFullYear();
        const month = now.getUTCMonth() + 1;
        const day = now.getUTCDate();
        const hours = now.getUTCHours();
        const minutes = now.getUTCMinutes();

        const utcTimestring = `${year}-${month}-${day} ${hours}:${minutes}`;

        const utc = new Date(utcTimestring);
        let userTimestring = interaction.options.getString('time');
        const userTime = new Date(userTimestring);

        //find the difference between utc time and the user entered local time
        const difference = (userTime - utc) / (60 * 1000);
        const minuteOffset = difference % 60;
        const value = difference - minuteOffset;
        const hourOffset = value / 60;
        //check whether the time they entered was valid
        if (isNaN(hourOffset) == true || isNaN(minuteOffset) == true) {
            const invalidDateEmbed = new EmbedBuilder()
                .setTitle('Error')
                .setDescription('the date you entered was invalid. Please try again.' +
                    'if you need help, run the /timezone-help command')
                .setColor('Red');
            await interaction.reply({ embeds: [invalidDateEmbed], ephemeral: true });
            return -1;
        }
        const updateReminders = await updateTimes(userId, guildId, hourOffset, minuteOffset); //test
        //update the database
        const result = await updateDataBase(minuteOffset, hourOffset, userId, guildId);
        //handle errors
        if (result == -100) {
            const unexpectedErrorEmbed = new EmbedBuilder()
                .setTitle('Error')
                .setDescription('An unexpected error has occured. Please try again later')
                .setColor('Red');
            interaction.reply({ embeds: [unexpectedErrorEmbed], ephemeral: true });
        }
        if (result == -1) {
            const errorEmbed = new EmbedBuilder()
                .setTitle('Error')
                .setDescription('Your new timezone settings match your old timezone settings.')
                .setColor('Red');
            interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
        if (result == 0) {
            const embed = new EmbedBuilder()
                .setTitle('Timezone Congifuration')
                .setDescription('You have successfully configured your timezone')
                .setColor('Green');
            interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
}
async function updateDataBase(minuteOffset, hourOffset, userId, guildId) {
    const query = {
        userId: userId,
        guildId: guildId,
        timezoneSpecified: true,
    };

    const user = await timezoneSchema.find(query);
    if (user.length > 1) {
        return -100;
    }
    if (user.length == 0) {
        const newTimezone = timezoneSchema({
            userId: userId,
            guildId: guildId,
            timezoneSpecified: true,
            hours: hourOffset,
            minutes: minuteOffset,
        });
        await newTimezone.save().catch((error) => { console.log(`error uploading reminder to database. error: ${error}`); return -1; })
        return 0;
    } else {
        if (user[0].hours == hourOffset && user[0].minutes == minuteOffset) {
            return -2;
        } else {
            await user[0].deleteOne(query);
            const newTimezone = timezoneSchema({
                userId: userId,
                guildId: guildId,
                timezoneSpecified: true,
                hours: hourOffset,
                minutes: minuteOffset,
            });
            await newTimezone.save().catch((error) => { console.log(`error uploading reminder to database. error: ${error}`); return -1; })
            return 0;
        }
    }
}
//test this code
async function updateTimes(userId, guildId, newHourOffset, newMinuteOffset) {
    const query = {
        userId: userId,
        guildId: guildId,
    };
    const timezoneQuery = {
        userId: userId,
        guildId: guildId,
        timezoneSpecified: true,
    }
    const reminders = await dailyReminderSchema.find(query);
    if (reminders.length == 0) {
        return 0;
    }
    const timezone = await timezoneSchema.find(timezoneQuery);
    //get the original offset
    let hourOffset;
    let minuteOffset;
    if (timezone.length == 0) {
        const now = new Date();
        const month = now.getMonth();
        if (month == 3) {
            const date = now.getDate();
            if (date >= 12) {
                hourOffset = -4;
                minuteOffset = 0;
            }
        }
        if (month == 11) {
            const date = now.getDate();
            if (date < 11) {
                hourOffset = -4;
                minuteOffset = 0;
            }
        }
        if (mounth > 3 && month < 11) {
            hourOffset = -4;
            minuteOffset = 0;
        } else {
            hourOffset = -5
            minuteOffset = 0;
        }
    } else {
        hourOffset = timezone[0].hours;
        minuteOffset = timezone[0].minutes;
    }

    for (let i = 0; i < reminders.length; i++) {
        const reminder = reminders[i].reminder;
        const channel = reminders[i].channel;
        let hour = reminders[i].hours;
        let minute = reminders[i].minutes;
        await reminders[i].deleteOne();
        //convert the time back into local time
        hour = hour + hourOffset;
        minute = minute + minuteOffset;
        if (minute >= 60) {
            minute = minute - 60;
            hour++;
        }
        if (hour >= 24) {
            hour = hour - 24;
        }
        if (minute < 0) {
            minute = 60 + minute;
            hour--;
        }
        if (hour < 0) {
            hour = hour + 24;
        }
        //calculate the new time
        let newMinute = minute - newMinuteOffset;
        let newHour = hour - newHourOffset;
        if (newMinute >= 60) {
            newMinute = newMinute - 60;
            newHour++;
        }
        if (newHour >= 24) {
            newHour = newHour - 24;
        }
        if (newMinute < 0) {
            newMinute = 60 + newMinute;
            newHour--;
        }
        if (newHour < 0) {
            newHour = 24 + newHour;
        }
        const newReminder = dailyReminderSchema({
            userId: userId,
            guildId: guildId,
            reminder: reminder,
            hours: newHour,
            minutes: newMinute,
            channel: channel,
        });
        await newReminder.save().catch((error) => { console.log(`error uploading reminder to database. error: ${error}`); return -2; });
        return 0;

    }

}