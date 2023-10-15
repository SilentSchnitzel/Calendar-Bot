const handleKick = require('./handle-bot-kick.js');
const removeUser = require('./remove-user.js');
const { Client, EmbedBuilder } = require('discord.js');
const weeklyReminderSchema = require('../models/weekly-reminder-schema.js');
/**
 * 
 * @param {Client} client 
 */


async function weeklyReminderChecker(client) {
    const currentTime = new Date();
    const query = {
        hours: currentTime.getUTCHours(),
        minutes: currentTime.getUTCMinutes(),
        day: currentTime.getUTCDay(),
    }
    const users = await weeklyReminderSchema.find(query);
    console.log(users.length);
    for (let i = 0; i < users.length; i++) {
        const guildId = users[i].guildId;
        const guild = client.guilds.cache.get(guildId);
        if (!guild) {
            console.log('invalid guild id');
            handleKick(guildId);
            return;
        }
        const userId = users[i].userId;
        const recipient = guild.members.cache.get(userId);
        if (!recipient) {
            console.log('invalid user');
            removeUser(userId, guildId)
            return;
        }
        const embed = new EmbedBuilder()
            .setTitle('Weekly Reminder')
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

module.exports = weeklyReminderChecker;