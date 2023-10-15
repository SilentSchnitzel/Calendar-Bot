const { EmbedBuilder, SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const weeklyReminderSchema = require('../models/weekly-reminder-schema.js');
const convertTimeStringToDate = require('../utils/convertToDate.js');
const TimezoneOffsetRetriever = require('../utils/timezone-offset-retriever.js');
const warning = require('../utils/warning.js');
const updateWeeklyReminders = require('../utils/weekly-reminder-users.js');
const checkDuplicateWeeklyReminders = require('../utils/check-duplicate-weekly-reminders.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('weekly-reminder')
        .setDescription('A command that allows you to create weekly reminders')
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
                .setRequired(true))
        .addStringOption(option4 =>
            option4.setName('day')
                .setDescription('enter in the day you would like to recieve your reminder every week')
                .setRequired(true)),
    async execute(interaction) {
        const time = interaction.options.getString('time');
        const reminder = interaction.options.getString('reminder');
        const channel = interaction.options.getString('channel');
        const day = interaction.options.getString('day');
        const userId = interaction.user.id;
        const guildId = interaction.guildId;
        //check to see whether the input is valid
        let result = convertDayToNumber(day);
        if (result == -1) {
            const invalidDayEmbed = new EmbedBuilder()
                .setTitle('Error')
                .setDescription('The day you entered was invalid. for help, run the /help command')
                .setColor('Red');
            interaction.reply({ embeds: [invalidDayEmbed], ephemeral: true });
            return;
        }
        const [hours, minutes] = convertTimeStringToDate(time);
        if (hours == null && minutes == null) {
            invalidDateEmbed = new EmbedBuilder()
                .setTitle('Error')
                .setDescription('The time you entered was invalid.\n' +
                    'For help, run the `/help` command.')
                .setColor('Red');
            await interaction.reply({ embeds: [invalidDateEmbed], ephemeral: true });
            return;
        }
        const duplicateResult = await checkDuplicateWeeklyReminders(userId, guildId, reminder, result);
        if (duplicateResult == -1) {
            const duplicateReminderEmbed = new EmbedBuilder()
                .setTitle('Error')
                .setDescription('the reminder you entered matches another one of your weekly reminders and thus this reminder will not be saved. you may not have duplicate weekly reminders')
                .setColor('Red');
            await interaction.reply({ embeds: [duplicateReminderEmbed], ephemeral: true });
            return;
        }
        const t = new TimezoneOffsetRetriever(userId, guildId, hours, minutes);
        const offsets = await t.getUserTimezone();
        let newTime = [null, null];
        if (offsets[0] == null) {
            newTime = t.applyDefaultOffset();
        } else {
            newTime = t.applyOffset(offsets[0], offsets[1]);
        }
        if (newTime[0] == null || newTime[1] == null) {
            const unexpectedErrorEmbed = new EmbedBuilder()
                .setTitle('New Weekly Reminder')
                .setDescription('An unexpected error has occured. Please try again later.')
                .setColor('Red');
            await interaction.reply({ embeds: [unexpectedErrorEmbed], ephemeral: true });
        }
        if (offsets[0] < 0) {
            if (newTime[0] < hours) {
                result++;
                if (result == 7) {
                    result = 0;
                }
            }
        }
        if (offsets[0] > 0) {
            if (newTime[0] > hours) {
                result--;
                if (result == -1) {
                    result = 6;
                }
            }
        }
        const embed = new EmbedBuilder()
            .setTitle('New Weekly Reminder')
            .setDescription(`Calendar Bot will now remind you every ${day} at ${time} to do this task: ${reminder} in this channel: ${channel}`)
            .setColor('Green');
        const DBresult = await updateWeeklyReminders(userId, guildId, reminder, newTime[0], newTime[1], channel, result);
        //handle any errors that occured from updating the database
        if (DBresult == -1) {
            const commandFailedEmbed = new EmbedBuilder()
                .setTitle('New Daily Reminder')
                .setDescription('you already have a maximum of 5 daily reminder. You must delete one of your daily reminders to add this reminder.')
                .setColor('Red');
            await interaction.reply({ embeds: [commandFailedEmbed], ephemeral: true })
        } else if (DBresult == -2) {
            const unexpectedErrorEmbed = new EmbedBuilder()
                .setTitle('New Daily Reminder')
                .setDescription('An unexpected error has occured. Please try again later.')
                .setColor('Red');
            await interaction.reply({ embeds: [unexpectedErrorEmbed], ephemeral: true });
        } else {
            //warn the user if they have not set their timezone
            const w = new warning(userId, guildId);
            const warnUser = await w.getUser();
            if (warnUser == 1) {
                const button = new ButtonBuilder()
                    .setCustomId('warn')
                    .setLabel('Do Not Show Again')
                    .setStyle(ButtonStyle.Primary);

                const warningEmbed = new EmbedBuilder()
                    .setTitle('Warning')
                    .setDescription('It appears that you have not configured your timezone. It will be assumed that you live in America/New York')
                    .setColor('Red');

                const row = new ActionRowBuilder()
                    .addComponents(button);
                await interaction.reply({ embeds: [embed, warningEmbed], components: [row], ephemeral: true });
            } else {
                await interaction.reply({ embeds: [embed], ephemeral: true });
            }
        }
    }
}
function convertDayToNumber(day) {
    day = day.toLowerCase();
    if (day == 'monday') {
        return 1;
    }
    if (day == 'tuesday') {
        return 2;
    }
    if (day == 'wednesday') {
        return 3;
    }
    if (day == 'thursday') {
        return 4;
    }
    if (day == 'friday') {
        return 5;
    }
    if (day == 'saturday') {
        return 6;
    }
    if (day == 'sunday') {
        return 0;
    }
    return -1;

}