const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const weeklyReminderSchema = require('../models/weekly-reminder-schema.js');
const timezoneSchema = require('../models/timezone-schema.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('display-weekly-reminders')
        .setDescription('Run this command to view all of the weekly reminders you have registered'),
    async execute(interaction) {
        const userId = interaction.user.id
        const guildId = interaction.guildId;
        const query = {
            userId: userId,
            guildId: guildId,
        };
        const weeklyReminders = await weeklyReminderSchema.find(query);
        let weeklyReminderOne = 'n/a';
        let weeklyReminderTwo = 'n/a';
        let weeklyReminderThree = 'n/a';
        let weeklyReminderFour = 'n/a';
        let weeklyReminderFive = 'n/a';
        let weeklyReminderTimeOne = 'n/a';
        let weeklyReminderTimeTwo = 'n/a';
        let weeklyReminderTimeThree = 'n/a';
        let weeklyReminderTimeFour = 'n/a';
        let weeklyReminderTimeFive = 'n/a';
        let weeklyReminderDayOne = 'n/a';
        let weeklyReminderDayTwo = 'n/a';
        let weeklyReminderDayThree = 'n/a';
        let weeklyReminderDayFour = 'n/a';
        let weeklyReminderDayFive = 'n/a';
        for (let i = 0; i < (await weeklyReminders).length; i++) {
            if (i == 0) {
                weeklyReminderOne = weeklyReminders[i].reminder;
                const minute = weeklyReminders[i].minutes;
                const hour = weeklyReminders[i].hours;
                const timestring = await unapplyOffset(hour, minute, userId, guildId);
                weeklyReminderTimeOne = timestring;
                weeklyReminderDayOne = numberToDay(weeklyReminders[i].day);
            }
            if (i == 1) {
                weeklyReminderTwo = weeklyReminders[i].reminder;
                const minute = weeklyReminders[i].minutes;
                const hour = weeklyReminders[i].hours;
                weeklyReminderTimeTwo = await unapplyOffset(hour, minute, userId, guildId);
                weeklyReminderDayTwo = numberToDay(weeklyReminders[i].day);
            }
            if (i == 2) {
                weeklyReminderThree = weeklyReminders[i].reminder;
                const minute = weeklyReminders[i].minutes;
                const hour = weeklyReminder[i].hours;
                weeklyReminderTimeThree = await unapplyOffset(hour, minute, userId, guildId);
                weeklyReminderDayThree = numberToDay(weeklyReminders[i].day);
            }
            if (i == 3) {
                weeklyReminderFour = weeklyReminders[i].reminder;
                const minute = weeklyReminders[i].minutes;
                const hour = weeklyReminders[i].hours;
                weeklyReminderTimeFour = await unapplyOffset(hour, minute, userId, guildId);
                weeklyReminderDayFour = numberToDay(weeklyReminders[i].day);
            }
            if (i == 4) {
                weeklyReminderFive = weeklyReminders[i].reminder;
                const minute = weeklyReminders[i].minutes;
                const hour = weeklyReminders[i].hours;
                weeklyReminderTimeFive = await unapplyOffset(hour, minute, userId, guildId);
                weeklyReminderDayFive = numberToDay(weeklyReminders[i].day);
            }
        }
        const embed = new EmbedBuilder()
            .setTitle('Daily Reminders')
            .setDescription(
                `Reminder slot one: ${weeklyReminderOne}, time: ${weeklyReminderTimeOne}, day: ${weeklyReminderDayOne}\n` +
                `Reminder slot two: ${weeklyReminderTwo}, time: ${weeklyReminderTimeTwo}, day: ${weeklyReminderDayTwo}\n` +
                `Reminder slot three: ${weeklyReminderThree}, time: ${weeklyReminderTimeThree}, day: ${weeklyReminderDayThree}\n` +
                `Reminder slot four: ${weeklyReminderFour}, time: ${weeklyReminderTimeFour}, day: ${weeklyReminderDayFour}\n` +
                `Reminder slot five: ${weeklyReminderFive}, time: ${weeklyReminderTimeFive}, day: ${weeklyReminderDayFive}`
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
function numberToDay(day) {
    let result;
    if (day == 1) {
        result = 'Monday';
    }
    if (day == 2) {
        result = 'Tuesday';
    }
    if (day == 3) {
        result = 'Wednesday';
    }
    if (day == 4) {
        result = 'Thursday';
    }
    if (day == 5) {
        result = 'Friday';
    }
    if (day == 6) {
        result = 'Saturday';
    }
    if (day == 0) {
        result = 'Sunday';
    }
    return result;
}