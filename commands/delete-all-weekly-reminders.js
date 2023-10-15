const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const weeklyReminderSchema = require('../models/weekly-reminder-schema.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('delete-all-weekly-reminders')
        .setDescription('Run this command to delete all of you weekly reminders'),
    async execute(interaction) {
        const userId = interaction.user.id;
        const guildId = interaction.guildId;
        const query = {
            userId: userId,
            guildId: guildId,
        }
        const weeklyReminders = await weeklyReminderSchema.find(query);
        if (weeklyReminders.length == 0) {
            const errorEmbed = new EmbedBuilder()
                .setTitle('Error')
                .setDescription('You have not created any weekly reminders yet')
                .setColor('Red');
            interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            return;
        }
        for (let i = 0; i < weeklyReminders.length; i++) {
            await weeklyReminders[i].deleteOne();
        }
        const embed = new EmbedBuilder()
            .setTitle('Delete All Weekly Reminders')
            .setDescription('You have successfully deleted all of your weekly reminders.')
            .setColor('Green');
        interaction.reply({ embeds: [embed], ephemeral: true });
    }
}