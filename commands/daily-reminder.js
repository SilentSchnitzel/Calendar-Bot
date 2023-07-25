const { EmbedBuilder, SlashCommandBuilder, UserFlags } = require('discord.js');
const updateDB = require('../utils/daily-reminder-users.js');
const checkDuplicateDailyReminders = require('../utils/check-duplicate-daily-reminders.js');
const timezoneSchema = require('../models/timezone-schema.js');

//.addStringOption is how you add arguments to your command allowing for user input
module.exports = {
    data: new SlashCommandBuilder()
        .setName('daily-reminder')
        .setDescription('A command that allows you to set daily reminders for yourself')
        .addStringOption(option1 =>
            option1.setName('time')
                .setDescription('set the time at which you would like to recieve your daily reminder')
                .setRequired(true))
        .addStringOption(option2 =>
            option2.setName('reminder')
                .setDescription('write what you need to be reminded about')
                .setRequired(true))
        .addStringOption(option3 =>
            option3.setName('channel')
                .setDescription('channel you would like to recieve your reminder in. type dm to recieve reminder in dms')
                .setRequired(true)),
    async execute(interaction) {
        //getting user input (time and reminder)
        const time = interaction.options.getString('time');
        const reminder = interaction.options.getString('reminder');
        const channel = interaction.options.getString('channel');

        const [hours, minutes] = convertTimeStringToDate(time);
        //if the date is invalid, then inform the user
        if (hours == null && minutes == null) {
            invalidDateEmbed = new EmbedBuilder()
                .setTitle('Error')
                .setDescription('The time you entered was invalid.\n' +
                    'For help using this command, run the `/help` command.')
                .setColor('Red');
            await interaction.reply({ embeds: [invalidDateEmbed], ephemeral: true });
            return;
        }

        const userId = interaction.user.id;
        const guildId = interaction.guildId;

        const initialEmbed = new EmbedBuilder()
            .setTitle('New Daily Reminder')
            .setDescription(`Calendar Bot will now remind you every day at ${time} to do this task: ${reminder} in this channel: ${channel}.`)
            .setColor('Green');

        const duplicate = await checkDuplicateDailyReminders(userId, guildId, reminder);
        if (duplicate == -1) {
            const duplicateReminderEmbed = new EmbedBuilder()
                .setTitle('Error')
                .setDescription('the reminder you entered matches another one of your reminders and thus this reminder will not be saved. you may not have duplicate reminders')
                .setColor('Red');
            await interaction.reply({ embeds: [duplicateReminderEmbed], ephemeral: true });
            return;
        }
        const info = await getTimezone(userId, guildId);
        const result = await updateDB(userId, guildId, reminder, hours, minutes, channel);
        if (result == -1) {
            const commandFailedEmbed = new EmbedBuilder()
                .setTitle('New Daily Reminder')
                .setDescription('you already have a maximum of 5 daily reminder. You must delete one of your daily reminders to add this reminder.')
                .setColor('Red');
            await interaction.reply({ embeds: [commandFailedEmbed], ephemeral: true })
        } else if (result == -2) {
            const unexpectedErrorEmbed = new EmbedBuilder()
                .setTitle('New Daily Reminder')
                .setDescription('An unexpected error has occured. Please try again later.')
                .setColor('Red');
            await interaction.reply({ embeds: [unexpectedErrorEmbed], ephemeral: true });
        } else {
            await interaction.reply({ embeds: [initialEmbed], ephemeral: true });

        }
    }

}

//convert strings like "8:00" and "22:00" to something of type date
function convertTimeStringToDate(timeString) {
    var date = new Date();
    //splits the string into the hour and minute part
    var timeComponents = timeString.split(':');
    var hours = parseInt(timeComponents[0], 10);
    var minutes = parseInt(timeComponents[1], 10);
    // Set the hours and minutes of the date object
    date.setHours(hours);
    date.setMinutes(minutes);

    //checks to see if the date is valid
    const validity = isNaN(date);
    if (validity == true) {
        return [null, null];
    }
    if (hours > 23) {
        return [null, null];
    }
    if (minutes > 59) {
        return [null, null];
    }
    return [hours, minutes];
}

async function getTimezone(userId, guildId) {
    let hours;
    let minutes;
    let status;
    const query = {
        userId: userId,
        guildId: guildId,
        timezoneSpecified: true,
    }
    const user = await timezoneSchema.find(query);
    console.log(user);
    if (user.length > 1) {
        status = -1;
        return [status, hours, minutes];
    }
    if (user.length == 0) {
        status = 0;
        return [status, hours, minutes];
    }
    status = 1;
    hours = user[0].hours;
    minutes = user[0].minutes;
    console.log(hours);
    console.log(minutes);
    return [status, hours, minutes];
}
