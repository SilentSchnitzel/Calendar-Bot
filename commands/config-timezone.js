const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const timezoneSchema = require('../models/timezone-schema.js');

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