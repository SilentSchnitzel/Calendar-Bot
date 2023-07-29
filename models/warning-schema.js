const { Schema, model } = require('mongoose');

const warningSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    guildId: {
        type: String,
        required: true,
    },
    warnUser: {
        type: Boolean,
        required: true,
    },
});

module.exports = model('warning-schema', warningSchema);