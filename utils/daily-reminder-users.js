const dailyReminderUsers = require('../models/daily-reminder-schema.js');

//this function will update the database on the user input
async function updateDB(userId, guildId, reminder, hours, minutes) {
    // a query is a request for information from a database
    const query = {
        userId: userId,
        guildId: guildId,
    };
    //get all daily reminders that a specific user has registered
    const users = await dailyReminderUsers.find(query);
    //if the user does not have any daily reminders in the database
    if (users.length == 0) {
        //register daily reminder and put it in the database
        const newReminder = dailyReminderUsers({
            userId: userId,
            guildId: guildId,
            reminder: reminder,
            hours: hours,
            minutes: minutes,
        });
        await newReminder.save().catch((error) => { console.log(`error uploading reminder to database. error: ${error}`); return -2; })
    }
    //if the user does have some reminders registered in the database,
    //check to see if the amount has not exceeded 5 (maximum amount of daily reminders one user is allowed to have)
    if (users.length == 5) {
        return -1;
    }
}


module.exports = updateDB;