const { Schema, model } = require('mongoose');

const weeklyReminderSchema = new Schema({
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
    day: {
        type: Number,
        required: true,
    },
});

module.exports = model('weekly-reminder-schema', weeklyReminderSchema);