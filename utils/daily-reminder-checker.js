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
        if (users[i].channel === 'dm') {
            recipient.send({ embeds: [embed] });
            return;
        } else {
            const channelName = guild.channels.cache.find(c => c.name == users[i].channel && c.type == 0);
            if (!channelName) {
                const invalidChannelEmbed = new EmbedBuilder()
                    .setTitle('Error')
                    .setDescription(`invalid channel for this reminder: ${users[i].reminder}`)
                    .setColor('Red');
                recipient.send({ embeds: [invalidChannelEmbed] });

            } else {
                const channelId = channelName.id;
                if (!channelId) {
                    console.log('invalid channel id');
                }
                const channel = guild.channels.cache.get(channelId);
                channel.send({ content: `<@${users[i].userId}>`, embeds: [embed] });
            }
        }

    }
}

module.exports = check_daily_reminders;