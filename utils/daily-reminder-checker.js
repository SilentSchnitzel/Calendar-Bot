const dailyReminderUsers = require('../models/daily-reminder-schema.js');
const { Client, EmbedBuilder } = require('discord.js')
/**
 * 
 * @param {Client} client 
 */

//this function will run every minute to check to see if any reminders need to be sent out
async function check_daily_reminders(client) {
    const currentTime = new Date();
    const query = {
        hours: currentTime.getHours(),
        minutes: currentTime.getMinutes(),
    };

    const users = await dailyReminderUsers.find(query);

    for (let i = 0; i < users.length; i++) {
        const guildId = users[i].guildId;
        const guild = client.guilds.cache.get(guildId);
        if (!guild) {
            console.log('invalid guild id');
            return;
        }
        const userId = users[i].userId;
        const recipient = guild.members.cache.get(userId);
        if (!recipient) {
            console.log('invalid user');
            return;
        }
        const embed = new EmbedBuilder()
            .setTitle('Daily Reminder')
            .setDescription(`It is now time to: ${users[i].reminder}`)
            .setColor('Gold');

        recipient.send({ embeds: [embed] });

    }
}

module.exports = check_daily_reminders;