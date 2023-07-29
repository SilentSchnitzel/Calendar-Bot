const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('utc-time')
        .setDescription('run this command to view UTC Time (Coordinated Universal Time)'),
    async execute(interaction) {
        const now = new Date();

        const year = now.getUTCFullYear();
        const month = now.getUTCMonth() + 1;
        const day = now.getUTCDate();
        const hours = now.getUTCHours();
        const minutes = now.getUTCMinutes();
        const seconds = now.getUTCSeconds();
        const milliseconds = now.getUTCMilliseconds();

        const embed = new EmbedBuilder()
            .setTitle('UTC Time')
            .setDescription(`UTC Time: ${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}\n` +
                `Hours: ${hours}\n` +
                `Minutes: ${minutes}`)
            .setColor('White');
        interaction.reply({ embeds: [embed], ephemeral: true });
    }

};