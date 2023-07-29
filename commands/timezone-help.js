const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timezone-help')
        .setDescription('Run this command if you need help setting your timezone'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('Timezone Help')
            .setColor('Blue')
            .addFields({
                name: 'Setting your timezone', value:
                    `In order to figure out what you should set your timezone to,\n` +
                    `you need to figure out how far off local time is from UTC time\n` +
                    `To see UTC time, you can either look it up on the internet or run\n` +
                    `/utc-time. Then find the difference between your times and use that\n` +
                    `to select your timezone. look below for an example`
            })
            .addFields({
                name: 'Examples', value:
                    `if /utc-time returns this:\n` +
                    `2023-6-17 16:0:0.0\n` +
                    `Hours: 16\n` +
                    `Minutes: 0\n` +
                    `and local time is 18:00(6:00pm), then you should select the UTC + 2:00\n` +
                    `option on the /config-time-zones command\n` +
                    `if /utc-time returns this:\n` +
                    `2023-6-17 16:0:0.0\n` +
                    `Hours: 16\n` +
                    `Minutes: 0\n` +
                    `and local time is 12:30(12:30pm), then you should select the UTC - 3:30\n` +
                    `option on the /config-time-zones\n`
            });
        interaction.reply({ embeds: [embed], ephemeral: true });
    }
}