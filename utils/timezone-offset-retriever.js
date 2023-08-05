const timezoneSchema = require('../models/timezone-schema.js');


class TimezoneOffsetRetriever {
    constructor(userId, guildId, hour, minute) {
        this.userId = userId;
        this.guildId = guildId;
        this.hour = hour;
        this.minute = minute;
    }
    //get the user's timezone offset
    async getUserTimezone() {
        const query = {
            userId: this.userId,
            guildId: this.guildId,
            timezoneSpecified: true,
        }
        const timezoneUser = await timezoneSchema.find(query);
        if (timezoneUser.length > 1) {
            return [null, null];
        }
        if (timezoneUser.length == 0) {
            return [null, null];
        }
        return [timezoneUser[0].hours, timezoneUser[0].minutes];
    }
    //This function applies the offset that the config-timezone command calculated
    applyOffset(hourOffset, minuteOffset) {
        let newMinute = this.minute - minuteOffset
        let newHour = this.hour - hourOffset;
        if (newMinute >= 60) {
            newMinute = newMinute - 60;
            newHour++;
        }
        if (newHour >= 24) {
            newHour = newHour - 24;
        }
        if (newMinute < 0) {
            newMinute = 60 + newMinute;
            newHour--;
        }
        if (newHour < 0) {
            newHour = 24 + newHour;
        }
        return [newHour, newMinute];

    }
    //if the user has not set their timezone, then it will be assumed that they live in the USA.
    //This function gets the timezone offset of the USA and applies it to the user's time.
    applyDefaultOffset() {
        const now = new Date();
        const year = now.getUTCFullYear();
        const month = now.getUTCMonth() + 1;
        const day = now.getUTCDate();
        const hours = now.getUTCHours();
        const minutes = now.getUTCMinutes();

        const utcTimestring = `${year}-${month}-${day} ${hours}:${minutes}`;

        const utc = new Date(utcTimestring);
        const difference = Math.round((now - utc) / (60 * 1000));
        const minuteOffset = difference % 60;
        const value = difference - minuteOffset;
        const hourOffset = value / 60;

        let newMinute = this.minute - minuteOffset
        let newHour = this.hour - hourOffset;
        if (newMinute >= 60) {
            newMinute = newMinute - 60;
            newHour++;
        }
        if (newHour >= 24) {
            newHour = newHour - 24;
        }
        if (newMinute < 0) {
            newMinute = 60 + newMinute;
            newHour--;
        }
        if (newHour < 0) {
            newHour = 24 + newHour;
        }
        return [newHour, newMinute];
    }
}
module.exports = TimezoneOffsetRetriever;