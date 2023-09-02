const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const dailyReminderSchema = require('../models/daily-reminder-schema.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('delete-all-daily-reminders')
        .setDescription('run this command to delete all of your daily reminders'),
    async execute(interaction) {
        const userId = interaction.user.id;
        const guildId = interaction.guildId;
        const query = {
            userId: userId,
            guildId: guildId,
        }
        const dailyReminders = await dailyReminderSchema.find(query);
        if (dailyReminders.length == 0) {
            const embed = new EmbedBuilder()
                .setTitle('Error')
                .setDescription('you have not created any daily reminders yet')
                .setColor('Red');
            interaction.reply({ embeds: [embed], ephemeral: true });
            return;
        }
        for (let i = 0; i < dailyReminders.length; i++) {
            await dailyReminders[i].deleteOne();
        }
        const embed = new EmbedBuilder()
            .setTitle('Delete Daily Reminders')
            .setDescription('All of your daily reminders have been successfully deleted')
            .setColor('Green');
        interaction.reply({ embeds: [embed], ephemeral: true });
    }
}