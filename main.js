const Discord = require('discord.js');

// creating discord bot as client
const client = new Discord.Client({intents: ["Guilds", "GuildMessages", "GuildScheduledEvents"]});


client.once('ready', () => {
    console.log("Bot online");
})

//has to be the last line of code in the file
client.login('MTExMzcyOTgyMzQ1ODcyMTc5Mg.GmXvO6.-Ub89s6wlVj_tvkDw-6TMGL8hyCquAV0EQGqLg');