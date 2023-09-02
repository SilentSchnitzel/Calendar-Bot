const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const timezoneSchema = require('../models/timezone-schema.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('display-timezone')
        .setDescription('run this command to see what you set your timezone as.'),
    async execute(interaction) {
        const userId = interaction.user.id;
        const guildId = interaction.guildId;
        const query = {
            userId: userId,
            guildId: guildId,
            timezoneSpecified: true,
        };
        const timezone = await timezoneSchema.find(query);
        if (timezone.length == 0) {
            const errorEmbed = new EmbedBuilder()
                .setTitle('Error')
                .setDescription('It appears that you have not yet configured your timezone.')
                .setColor('Red');
            interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        } else {
            let hour = timezone[0].hours;
            let minute = timezone[0].minutes;
            hour = hour.toString();
            minute = minute.toString();
            if (minute.length == 1) {
                minute = '0' + minute;
            }
            let timestring;
            let otherMinute;
            if (minute[0] == '-') {
                otherMinute = minute;
                otherMinute = otherMinute.replace('-', '');
            }
            if (hour[0] == '-') {
                if (otherMinute == null) {
                    timestring = 'UTC' + hour + ':' + minute;
                } else {
                    timestring = 'UTC' + hour + ':' + otherMinute;
                }

            } else {
                timestring = 'UTC+' + hour + ':' + minute;
            }
            const embed = new EmbedBuilder()
                .setTitle('Timezone')
                .setDescription(`Your timezone: ${timestring}`)
                .setColor('Blue');
            interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
}