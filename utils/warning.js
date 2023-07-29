const warningSchema = require('../models/warning-schema.js');
const timezoneSchema = require('../models/timezone-schema.js');
const { EmbedBuilder, Embed } = require('discord.js');

//whenever a user creates a new reminder, the bot will check to see whether
//they have set their timezone or not. If they have then the bot will not
//remind them to set their timezone
class warning {
    constructor(userId, guildId) {
        this.userId = userId;
        this.guildId = guildId;
    }
    async getUser() {
        const timezoneQuery = {
            userId: this.userId,
            guildId: this.guildId,
            timezoneSpecified: true,
        }
        const timezoneUser = await timezoneSchema.find(timezoneQuery);
        if (timezoneUser.length == 1) {
            return 0;
        }
        const query = {
            userId: this.userId,
            guildId: this.guildId,
            warnUser: false,
        }
        const user = await warningSchema.find(query);
        if (user.length == 1) {
            return 0;
        }
        return 1;
    }
    async editDatabase(userId, guildId) {
        const newUser = new warningSchema({
            userId: userId,
            guildId: guildId,
            warnUser: false,
        });
        newUser.save();
    }
}

module.exports = warning;