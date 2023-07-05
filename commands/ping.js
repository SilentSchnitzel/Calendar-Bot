const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Test connectivity'),
	async execute(interaction) {
		await interaction.deferReply({ephemeral: true});
		
		const reply = await interaction.fetchReply();

		const ping = reply.createdTimestamp - interaction.createdTimestamp

		const pingEmbed = new EmbedBuilder()
			.setColor("Grey")
			.addFields(
				{name: 'Client: ', value: `${ping}ms`, inline: true},
				{name: 'Websocket: ', value: `${interaction.client.ws.ping}ms`, inline: true},
			)

		//interaction.editReply(`Client: ${ping}ms | Websocket: ${interaction.client.ws.ping}ms`)
		interaction.editReply({embeds: [pingEmbed], ephemeral: true})
	}
	
}