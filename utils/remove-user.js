const warningSchema = require('../models/warning-schema.js');
const timezoneSchema = require('../models/timezone-schema.js');
const dailyReminderSchema = require('../models/daily-reminder-schema.js');
const weeklyReminderSchema = require('../models/weekly-reminder-schema.js');

async function removeUser(userId, guildId) {
    const warningQuery = {
        userId: userId,
        guildId: guildId,
    };
    const timezoneQuery = {
        userId: userId,
        guildId: guildId,
    };
    const dailyReminderQuery = {
        userId: userId,
        guildId: guildId,
    }
    const warningUsers = await warningSchema.find(warningQuery);
    for (let i = 0; i < warningUsers.length; i++) {
        await warningUsers[i].deleteOne();
    }
    const timezoneUsers = await timezoneSchema.find(timezoneQuery);
    for (let i = 0; i < timezoneUsers.length; i++) {
        await timezoneUsers[i].deleteOne();
    }
    const dailyReminderUsers = await dailyReminderSchema.find(dailyReminderQuery);
    for (let i = 0; i < dailyReminderUsers.length; i++) {
        await dailyReminderUsers[i].deleteOne();
    }
    const weeklyReminderUsers = await weeklyReminderSchema.find(weeklyReminderQuery);
    for (let i = 0; i < weeklyReminderUsers.length; i++) {
        await weeklyReminderUsers[i].deleteOne();
    }
}

module.exports = removeUser;