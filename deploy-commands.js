const { REST, Routes } = require('discord.js');
require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');


function deploy_commands(client) {
	const cmds = [];
	const fPath = path.join(__dirname, 'commands');
	const cmdFolders = fs.readdirSync(fPath);
	for (const folder of cmdFolders) {
		const Path = path.join(fPath, folder);
		const command = require(Path);

		if ('data' in command && 'execute' in command) {
			cmds.push(command.data.toJSON());
		} else {
			console.log(`[WARNING] The command at ${Path} is missing a required "data" or "execute" property.`);
		}
	}
	// Construct and prepare an instance of the REST module
	const rest = new REST({ version: '10' }).setToken(process.env.BOT_KEY);
	rest.put(Routes.applicationCommands(client.user.id), { body: cmds },);
	console.log('finished registering commands')
}

module.exports = deploy_commands;