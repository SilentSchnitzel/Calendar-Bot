const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');

// creating discord bot as client
const client = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, 
    GatewayIntentBits.GuildScheduledEvents, GatewayIntentBits.DirectMessages, 
    GatewayIntentBits.DirectMessageTyping, GatewayIntentBits.GuildMessageTyping]});

client.commands = new Collection();
//gets the path to the commands folder
const commandsPath = path.join(__dirname, "commands");
//looks at all of the files in the commands directory and filters out the non javascript files
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
//loops through all javascript files in the commands folder
for(const file of commandFiles)
{
    //sets the file path of a certain file which holds the code for a command
    const filePath = path.join(commandsPath, file);
    //determine the command name?
    const command = require(filePath);
    
    if('data' in command && 'execute' in command)
    {
        client.commands.set(command.name, command);
    } else
    {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}




//when an error does occur then display it in the console
client.on('error', console.error);
const prefix = "$";

client.once('ready', ()=>{
    console.log("Bot online");
})

client.on('interactionCreate', (interaction) => {
    if(!interaction.isChatInputCommand()) return;

    if(interaction.commandName === 'ping')
    {
        interaction.reply("pong!");
    }
})

//has to be the last line of code in the file
client.login(process.env.BOT_KEY);