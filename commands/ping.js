const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Test connectivity'),
	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true }); //ephemeral means that only the user who intiated the interaction with the bot can see the message

		const reply = await interaction.fetchReply();

		const ping = reply.createdTimestamp - interaction.createdTimestamp

		const pingEmbed = new EmbedBuilder()
			.setColor("Grey")
			.addFields(
				{ name: 'Client: ', value: `${ping}ms`, inline: true },
				{ name: 'Websocket: ', value: `${interaction.client.ws.ping}ms`, inline: true },
			);

		interaction.editReply({ embeds: [pingEmbed], ephemeral: true });
	}

}