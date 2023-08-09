const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const dailyReminderSchema = require('../models/daily-reminder-schema.js');
const timezoneSchema = require('../models/timezone-schema.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('display-daily-reminders')
        .setDescription('Run this command to view all of the daily reminders you have registered'),
    async execute(interaction) {
        const userId = interaction.user.id;
        const guildId = interaction.guildId;
        const query = {
            userId: userId,
            guildId: guildId,
        }
        const reminders = await dailyReminderSchema.find(query);
        let dailyReminderOne = 'n/a';
        let dailyReminderTwo = 'n/a';
        let dailyReminderThree = 'n/a';
        let dailyReminderFour = 'n/a';
        let dailyReminderFive = 'n/a';
        let dailyReminderTimeOne = 'n/a';
        let dailyReminderTimeTwo = 'n/a';
        let dailyReminderTimeThree = 'n/a';
        let dailyReminderTimeFour = 'n/a';
        let dailyReminderTimeFive = 'n/a';
        for (let i = 0; i < reminders.length; i++) {
            if (i == 0) {
                dailyReminderOne = reminders[i].reminder;
                const minute = reminders[i].minutes;
                const hour = reminders[i].hours;
                const timestring = await unapplyOffset(hour, minute, userId, guildId);
                dailyReminderTimeOne = timestring;
            }
            if (i == 1) {
                dailyReminderTwo = reminders[i].reminder;
                const minute = reminders[i].minutes;
                const hour = reminders[i].hours;
                const timestring = await unapplyOffset(hour, minute, userId, guildId);
                dailyReminderTimeTwo = timestring;
            }
            if (i == 2) {
                dailyReminderThree = reminders[i].reminder;
                const minute = reminders[i].minutes;
                const hour = reminders[i].hours;
                const timestring = await unapplyOffset(hour, minute, userId, guildId);
                dailyReminderTimeThree = timestring;
            }
            if (i == 3) {
                dailyReminderFour = reminders[i].reminder;
                const minute = reminders[i].minutes;
                const hour = reminders[i].hours;
                const timestring = await unapplyOffset(hour, minute, userId, guildId);
                dailyReminderTimeFour = timestring;
            }
            if (i == 4) {
                dailyReminderFive = reminders[i].reminder;
                const minute = reminders[i].minutes;
                const hour = reminders[i].hours;
                const timestring = await unapplyOffset(hour, minute, userId, guildId);
                dailyReminderTimeFive = timestring;
            }
        }
        const embed = new EmbedBuilder()
            .setTitle('Daily Reminders')
            .setDescription(
                `Reminder slot one: ${dailyReminderOne}, time: ${dailyReminderTimeOne}\n` +
                `Reminder slot two: ${dailyReminderTwo}, time: ${dailyReminderTimeTwo}\n` +
                `Reminder slot three: ${dailyReminderThree}, time: ${dailyReminderTimeThree}\n` +
                `Reminder slot four: ${dailyReminderFour}, time: ${dailyReminderTimeFour}\n` +
                `Reminder slot five: ${dailyReminderFive}, time: ${dailyReminderTimeFive}`
            )
            .setColor('Blue');
        interaction.reply({ embeds: [embed], ephemeral: true });
    }
}
async function unapplyOffset(hour, minute, userId, guildId) {
    const query = {
        userId: userId,
        guildId: guildId,
        timezoneSpecified: true,
    };
    const timezone = await timezoneSchema.find(query);
    if (timezone.length > 1) {
        return null;
    }
    if (timezone.length == 1) {
        //get the offset
        let hourOffset = timezone[0].hours;
        let minuteOffset = timezone[0].minutes;
        //apply the offset
        hour = hour + hourOffset;
        minute = minute + minuteOffset;
        if (minute >= 60) {
            minute = minute - 60;
            hour++;
        }
        if (hour >= 24) {
            hour = hour - 24;
        }
        if (minute < 0) {
            minute = 60 + minute;
            hour--;
        }
        if (hour < 0) {
            hour = hour + 24;
        }
        hour = hour.toString();
        minute = minute.toString();
        if (minute.length == 1) {
            minute = '0' + minute;
        }
        const timestring = hour + ':' + minute;
        return timestring;
    } else {
        const now = new Date();
        const year = now.getUTCFullYear();
        const month = now.getUTCMonth() + 1;
        const day = now.getUTCDate();
        const hours = now.getUTCHours();
        const minutes = now.getUTCMinutes();

        const utcTimestring = `${year}-${month}-${day} ${hours}:${minutes}`;

        const utc = new Date(utcTimestring);
        const difference = Math.round((now - utc) / (60 * 1000));
        const minuteOffset = difference % 60;
        const value = difference - minuteOffset;
        const hourOffset = value / 60;

        minute = minute + minuteOffset;
        hour = hour + hourOffset;
        if (minute >= 60) {
            minute = minute - 60;
            hour++;
        }
        if (hour >= 24) {
            hour = hour - 24;
        }
        if (minute < 0) {
            minute = 60 + minute;
            hour--;
        }
        if (hour < 0) {
            hour = hour + 24;
        }
        hour = hour.toString();
        minute = minute.toString();
        if (minute.length == 1) {
            minute = '0' + minute;
        }
        const timestring = hour + ':' + minute;
        return timestring;
    }
}
