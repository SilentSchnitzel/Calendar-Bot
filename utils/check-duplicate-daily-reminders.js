const dailyReminderUsers = require('../models/daily-reminder-schema.js');

async function checkDuplicateDailyReminders(userId, guildId, reminder) {
    const query = {
        userId: userId,
        guildId: guildId,
    };
    let duplicate = false;
    const reminders = await dailyReminderUsers.find(query);
    for (let i = 0; i < reminders.length; i++) {
        let object = reminders[i].reminder;
        object = object.toLowerCase();
        reminder = reminder.toLowerCase();
        if (object == reminder) {
            duplicate = true;
            break;
        }
    }
    if (duplicate == true) {
        return -1;
    }
    return 0;
}

module.exports = checkDuplicateDailyReminders;