const weeklyReminderSchema = require('../models/weekly-reminder-schema.js');

async function updateWeeklyReminders(userId, guildId, reminder, hours, minutes, channel, day) {
    const query = {
        userId: userId,
        guildId: guildId,
    };
    const weeklyReminders = await weeklyReminderSchema.find(query);
    if (weeklyReminders.length == 5) {
        return -1;
    }
    const newWeeklyReminder = weeklyReminderSchema({
        userId: userId,
        guildId: guildId,
        reminder: reminder,
        hours: hours,
        minutes: minutes,
        channel: channel,
        day: day,
    });
    await newWeeklyReminder.save().catch((error) => { console.log(`error uploading reminder to database. error: ${error}`); return -2; });
    return 0
}

module.exports = updateWeeklyReminders;