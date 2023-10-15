const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const dailyReminderSchema = require('../models/daily-reminder-schema.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('delete-daily-reminder')
        .setDescription('run this command to delete one of you daily remidners')
        .addStringOption(option =>
            option.setName('reminder')
                .setDescription('Enter in the reminder in which you would like to delete')
                .setRequired(true)
        ),
    async execute(interaction) {
        const reminder = interaction.options.getString('reminder');
        const userId = interaction.user.id;
        const guildId = interaction.guildId;
        const query = {
            userId: userId,
            guildId: guildId,
            reminder: reminder,
        };
        const userReminder = await dailyReminderSchema.findOne(query);
        if (userReminder) {
            await userReminder.deleteOne();
            const embed = new EmbedBuilder()
                .setTitle('Delete Daily Reminder')
                .setDescription(`you have successfully delete your reminder: ${reminder}`)
                .setColor('Green');
            interaction.reply({ embeds: [embed], ephemeral: true });
        } else {
            const errorEmbed = new EmbedBuilder()
                .setTitle('Error')
                .setDescription('It appears that the daily reminder you have entered for deletion does not match any of the daily reminders you have registered. Please try again. for help run the /help command')
                .setColor('Red');
            interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    }
}