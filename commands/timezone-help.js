const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timezone-help')
        .setDescription('Run this command if you need help configuring your timezone'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('Timezone Help')
            .setColor('Blue')
            .addFields({
                name: 'Configuring your timezone', value:
                    'To configure your timezone, enter in local time in military time format. ' +
                    'Calendar bot will then use the time you entered to configure your timezone. ' +
                    'It is important to note however that if you move to a place that has a ' +
                    'different timezone, then you will need to reconfigure your timezone in ' +
                    'accordance to your new local time. In addition, if you set your clock ' +
                    'forward or backward one hour due to daylight savings, then you will need ' +
                    'to reconfigure your timezone by entering in your new updated time.'
            })
        interaction.reply({ embeds: [embed], ephemeral: true });
    }
}