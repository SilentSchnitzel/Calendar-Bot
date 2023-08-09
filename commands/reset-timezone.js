const { EmbedBuilder, SlashCommandBuilder, Embed } = require('discord.js');
const timezoneSchema = require('../models/timezone-schema.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reset-timezone')
        .setDescription('Running this command to delete your timezone configuration'),
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
                .setDescription('You have not configured your timezone yet')
                .setColor('Red');
            interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            return;
        }
        await timezone[0].deleteOne();
        const embed = new EmbedBuilder()
            .setTitle('Reset Timezone')
            .setDescription('You have successfully deleted your timezone configuration. to reconfigure a new one, run the /config-timezone command.')
            .setColor('Green')
        interaction.reply({ embeds: [embed], ephemeral: true });
    }
}