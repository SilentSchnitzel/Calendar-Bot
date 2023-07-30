const { Schema, model } = require('mongoose');

const timezoneSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    guildId: {
        type: String,
        required: true,
    },
    timezoneSpecified: {
        type: Boolean,
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
    dayLightSavingsTime: {
        type: Boolean,
        required: true,
    },
});

module.exports = model('timezone-schema', timezoneSchema);