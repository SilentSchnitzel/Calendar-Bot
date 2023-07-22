const { Client, Collection, GatewayIntentBits } = require('discord.js');
require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const helper = require('./commands/help.js');
const ping = require('./commands/ping.js');
const daily_reminder = require('./commands/daily-reminder');
const deploy_commands = require('./deploy-commands.js');
const check_daily_reminders = require('./utils/daily-reminder-checker');
const config_timezone = require('./commands/config-time-zones.js');
const mongoose = require('mongoose');
const { config } = require('dotenv');
// creating discord bot as client
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildScheduledEvents, GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageTyping, GatewayIntentBits.GuildMessageTyping]
});
//connecting to mongodb database
(async () => {
    mongoose.set('strictQuery', false);
    mongoose.connect(process.env.MONGODB_URI, { keepAlive: true });
    console.log('connected to the database');
})();

client.commands = new Collection();
//gets the path to the commands folder
const commandsPath = path.join(__dirname, "commands");
//looks at all of the files in the commands directory and filters out the non javascript files
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
//loops through all javascript files in the commands folder
for (const file of commandFiles) {
    //sets the file path of a certain file which holds the code for a command
    const filePath = path.join(commandsPath, file);
    //determine the command name?
    const command = require(filePath);

    if ('data' in command && 'execute' in command) {
        client.commands.set(command.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

//when an error occurs then display it in the console
client.on('error', console.error);

client.once('ready', async () => {
    console.log("Bot online");
    deploy_commands(client);
})

//command handling
client.on('interactionCreate', (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'ping') {
        ping.execute(interaction); //run the execute component of the ping command
    }
    if (interaction.commandName === 'help') {
        helper.execute(interaction);
    }
    if (interaction.commandName === 'daily-reminder') {
        daily_reminder.execute(interaction);
    }
    if (interaction.commandName === 'config-time-zones') {
        config_timezone.execute(interaction);
    }
})
//run the check daily reminders function every minute to check for any reminders that need to be sent out
setInterval(() => {
    check_daily_reminders(client);
}, 60000);
//has to be the last line of code in the file
client.login(process.env.BOT_KEY);
