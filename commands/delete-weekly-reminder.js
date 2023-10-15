const { EmbedBuilder, SlashCommandBuilder, InteractionCollector } = require('discord.js');
const weeklyReminderSchema = require('../models/weekly-reminder-schema.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('delete-weekly-reminder')
        .setDescription('run this command to delete one of you weekly reminders')
        .addStringOption(option =>
            option.setName('reminder')
                .setDescription('Enter in the weekly reminder you want to delete')
                .setRequired(true)),
    async execute(interaction) {
        const reminder = interaction.options.getString('reminder');
        const userId = interaction.user.id;
        const guildId = interaction.guildId;
        const query = {
            userId: userId,
            guildId: guildId,
            reminder: reminder,
        };
        const userReminder = await weeklyReminderSchema.findOne(query);
        if (userReminder) {
            await userReminder.deleteOne();
            const embed = new EmbedBuilder()
                .setTitle('Delete Weekly Reminder')
                .setDescription(`you have successfully delete your daily reminder: ${reminder}`)
                .setColor('Green')
            interaction.reply({ embeds: [embed], ephemeral: true });
        } else {
            const errorEmbed = new EmbedBuilder()
                .setTitle('Delete Weekly Reminder')
                .setDescription('It appears that the weekly reminder you have entered for deletion does not match any of the weekly reminders you have registered. Please try again. for help run the /help command')
                .setColor('Red');
            interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    }
}