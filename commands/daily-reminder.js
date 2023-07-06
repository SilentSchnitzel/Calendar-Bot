const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('daily-reminder')
        .setDescription('foo')
        .addStringOption(option1 =>
            option1.setName('time')
                .setDescription('set the time at which you would like to recieve your daily reminder')
                .setRequired(true))
        .addStringOption(option2 =>
            option2.setName('reminder')
                .setDescription('write what you need to be reminded about')
                .setRequired(true)),
    async execute(interaction) {
        const time = interaction.options.getString('time');
        const reminder = interaction.options.getString('reminder');
        const initialEmbed = new EmbedBuilder()
            .setTitle('New Daily Reminder')
            .setDescription(`Calendar Bot will now reminde you every day at ${time} to do this task: ${reminder}`)
            .setColor('Green');
        await interaction.reply({ embeds: [initialEmbed], ephemeral: true });

    }
}
