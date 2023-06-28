const Discord = require('discord.js');
require('dotenv').config();

// creating discord bot as client
const client = new Discord.Client({intents: ["Guilds", "GuildMessages", "GuildScheduledEvents"]});


client.once('ready', () => {
    console.log("Bot online");
})

//has to be the last line of code in the file
client.login(process.env.BOT_KEY);