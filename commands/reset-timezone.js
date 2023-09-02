const { EmbedBuilder, SlashCommandBuilder, Embed } = require('discord.js');
const timezoneSchema = require('../models/timezone-schema.js');
const dailyReminderSchema = require('../models/daily-reminder-schema.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reset-timezone')
        .setDescription('Running this command to delete your timezone configuration'),
    async execute(interaction) {
        const userId = interaction.user.id;
        const guildId = interaction.guildId;

        const query = {
            userId: userId,
            guildId: guildId,
            timezoneSpecified: true,
        };
        const timezone = await timezoneSchema.find(query);
        if (timezone.length == 0) {
            const errorEmbed = new EmbedBuilder()
                .setTitle('Error')
                .setDescription('You have not configured your timezone yet')
                .setColor('Red');
            interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            return;
        }

        await timezone[0].deleteOne();
        const embed = new EmbedBuilder()
            .setTitle('Reset Timezone')
            .setDescription('You have successfully deleted your timezone configuration. to reconfigure a new one, run the /config-timezone command.')
            .setColor('Green')
        interaction.reply({ embeds: [embed], ephemeral: true });
    }
}

async function unpdateReminders(userId, guildId) {
    const query = {
        userId: userId,
        guildId: guildId,
    };
    //determining whether day light savings time is in effect
    let hourOffset;
    let minuteOffset;
    const now = new Date();
    const month = now.getMonth();
    if (month == 3) {
        const date = now.getDate();
        if (date >= 12) {
            hourOffset = -4;
            minuteOffset = 0;
        }
    }
    if (month == 11) {
        const date = now.getDate();
        if (date < 11) {
            hourOffset = -4;
            minuteOffset = 0;
        }
    }
    if (mounth > 3 && month < 11) {
        hourOffset = -4;
        minuteOffset = 0;
    } else {
        hourOffset = -5
        minuteOffset = 0;
    }
    //get the new time
    const utcHour = now.getUTCHours();
    const utcMinute = now.getUTCMinutes();

    const newHour = utcHour + hourOffset;
    const newMinute = utcMinute + minuteOffset;
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
        newHour = newHour + 24;
    }
    const reminders = await dailyReminderSchema.find(query);
    if (reminders.length == 0) {
        return 0;
    }
    for (let i = 0; i < reminders.length; i++) {
        const reminder = reminders[i].reminder;
        const channel = reminders[i].channel;
        await reminders[i].deleteOne();
        const newReminder = dailyReminderSchema({
            userId: userId,
            guildId: guildId,
            reminder: reminder,
            hours: newHour,
            minutes: newMinute,
            channel: channel,
        });
    }

}
