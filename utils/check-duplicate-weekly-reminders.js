const weeklyReminderUsers = require('../models/weekly-reminder-schema.js');

async function checkDuplicateWeeklyReminders(userId, guildId, reminder, day) {
    const query = {
        userId: userId,
        guildId: guildId,
        day: day,
    };
    let duplicate = false;
    const reminders = await weeklyReminderUsers.find(query);
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

module.exports = checkDuplicateWeeklyReminders;