const { Schema, model } = require('mongoose');

//framework for how the data will be organized and stored (schema)
//this allows for efficient storage retrieval and manipulation of the data
const dailyReminderSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    guildId: {
        type: String,
        required: true,
    },
    reminder: {
        type: String,
        required: true,
    },
    hours: {
        type: Number,
        required: true,
    },
    minutes: {
        type: Number,
        required: true,
    },
    channel: {
        type: String,
        required: true,
    },
});

module.exports = model('daily-reminder-schema', dailyReminderSchema);