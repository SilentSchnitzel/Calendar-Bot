const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('daily-reminder')
        .setDescription('foo'),
    async execute(interaction) {

    }
}