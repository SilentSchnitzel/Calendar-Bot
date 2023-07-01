const { SlashCommandBuilder } = require('discord.js');

// module.exports = {
// 	data: ping = new SlashCommandBuilder()
// 		.setName('ping')
// 		.setDescription('Replies with Pong!'),
// 	async execute(interaction) {
// 		await interaction.reply('Pong!');
// 	},
// };


module.exports = {
	
	data: ping = commandCreation(),
	async execute(interaction) {
		await interaction.reply('Pong!');
		
			
	}
};

function commandCreation()
{
	const ping = new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!');
	return ping;
}