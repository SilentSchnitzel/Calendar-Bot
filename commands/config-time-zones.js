const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const timezoneSchema = require('../models/timezone-schema.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('config-time-zones')
        .setDescription('Use this command to configure your timezone')
        .addStringOption(timezone =>
            timezone.setName('time-zone1')
                .setDescription('select your timezone here if you are behind or are using Coordinated Universal Time')
                .setRequired(false)
                .addChoices(
                    { name: 'UTC - 12:00', value: '-12' },
                    { name: 'UTC - 11:00', value: '-11' },
                    { name: 'UTC - 10:00', value: '-10' },
                    { name: 'UTC - 09:30', value: '-9,-30' },
                    { name: 'UTC - 09:00', value: '-9' },
                    { name: 'UTC - 08:00', value: '-8' },
                    { name: 'UTC - 07:00', value: '-7' },
                    { name: 'UTC - 06:00', value: '-6' },
                    { name: 'UTC - 05:00', value: '-5' },
                    { name: 'UTC - 04:00', value: '-4' },
                    { name: 'UTC - 03:30', value: '-3,-30' },
                    { name: 'UTC - 03:00', value: '-3' },
                    { name: 'UTC - 02:00', value: '-2' },
                    { name: 'UTC', value: '0' },
                    { name: 'UTC + 00:00', value: '0' },
                ))
        .addStringOption(timezone2 =>
            timezone2.setName('time-zone2')
                .setDescription('select your timezone here if you are ahead of thhe Coordinated Universal Time')
                .setRequired(false)
                .addChoices(
                    { name: 'UTC + 01:00', value: '1' },
                    { name: 'UTC + 02:00', value: '2' },
                    { name: 'UTC + 03:00', value: '3' },
                    { name: 'UTC + 03:30', value: '3,30' },
                    { name: 'UTC + 04:00', value: '4' },
                    { name: 'UTC + 04:30', value: '4,30' },
                    { name: 'UTC + 5:00', value: '5' },
                    { name: 'UTC + 05:30', value: '5,30' },
                    { name: 'UTC + 05:45', value: '5,45' },
                    { name: 'UTC + 06:00', value: '6' },
                    { name: 'UTC + 06:30', value: '6,30' },
                    { name: 'UTC + 07:00', value: '7' },
                    { name: 'UTC + 08:00', value: '8' },
                    { name: 'UTC + 08:45', value: '8,45' },
                    { name: 'UTC + 09:00', value: '9' },
                    { name: 'UTC + 9:30', value: '9,30' },
                    { name: 'UTC + 10:00', value: '10' },
                    { name: 'UTC + 10:30', value: '10,30' },
                    { name: 'UTC + 11:00', value: '11' },
                    { name: 'UTC + 12:00', value: '12' },
                    { name: 'UTC + 12:45', value: '12,45' },
                    { name: 'UTC + 13:00', value: '13' },
                    { name: 'UTC + 14:00', value: '14' },
                )),



    async execute(interaction) {
        const timezoneOne = interaction.options.getString('time-zone1');
        const timezoneTwo = interaction.options.getString('time-zone2');
        const userId = interaction.user.id;
        const guildId = interaction.guildId;
        const result = await handleInput(timezoneOne, timezoneTwo, userId, guildId);
        if (result == -100 || result == -1) {
            const unexpectedErrorEmbed = new EmbedBuilder()
                .setTitle('Error')
                .setDescription('An unexpected error has occured. Please try again later')
                .setColor('Red');
            interaction.reply({ embeds: [unexpectedErrorEmbed], ephemeral: true });
        }
        if (result == -2) {
            const errorEmbed = new EmbedBuilder()
                .setTitle('Error')
                .setDescription('You have already selected this tiemzone')
                .setColor('Red');
            interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
        if (result == 0) {
            const timezoneSetEmbed = new EmbedBuilder()
                .setTitle('Timezone')
                .setDescription('You have successfuly set your timezone!')
                .setColor('Green');
            interaction.reply({ embeds: [timezoneSetEmbed], ephemeral: true });
        }

    }

}

async function handleInput(timezoneOne, timezoneTwo, userId, guildId) {
    let hour, minute;
    if (timezoneOne && timezoneTwo) {
        return -1;
    }
    if (typeof (timezoneOne) == 'string') {
        const index = timezoneOne.indexOf(',');
        if (index != -1) {
            hour = timezoneOne.slice(0, index);
            minute = timezoneOne.slice(index + 1, timezoneOne.length);
        } else {
            hour = parseInt(timezoneOne);
        }
    } else {
        const index = timezoneTwo.indexOf(',');
        if (index != -1) {
            hour = timezoneTwo.slice(0, index);
            minute = timezoneTwo.slice(index + 1, timezoneTwo.length);
        } else {
            hour = parseInt(timezoneTwo);
        }
    }
    if (minute == null) {
        minute = 0;
    }
    const query = {
        userId: userId,
        guildId: guildId,
        timezoneSpecified: true,
    };
    const user = await timezoneSchema.find(query);
    if (user.length > 1) {
        return -100;
    }
    if (user.length == 0) {
        const newTimezone = timezoneSchema({
            userId: userId,
            guildId: guildId,
            timezoneSpecified: true,
            hours: hour,
            minutes: minute,
        });
        await newTimezone.save().catch((error) => { console.log(`error uploading reminder to database. error: ${error}`); return -1; })
        return 0;
    } else {
        if (user[0].hours == hour && user[0].minutes == minute) {
            return -2;
        } else {
            user[0].deleteOne(query);
            const newTimezone = timezoneSchema({
                userId: userId,
                guildId: guildId,
                timezoneSpecified: true,
                hours: hour,
                minutes: minute,
            });
            await newTimezone.save().catch((error) => { console.log(`error uploading reminder to database. error: ${error}`); return -1; })
            return 0;
        }
    }
}
//.addChoices(
// { name: 'Internation Date Line West', value: 'UTC - 12:00' },
// { name: 'Coordinated Universal Time -11', value: 'UTC - 11:00' },
// { name: 'Hawaii | Aleutian Islands', value: 'UTC - 10:00' },
// { name: 'Marquesas Islands', value: 'UTC - 9:30' },
// { name: 'Alaska | Coordinated Universal Time -09', value: 'UTC - 9:00' },
// { name: 'Baja California | Coordinated Universal Time -08 | Pacific Time (US & Canada)', value: 'UTC - 8:00' },
// { name: 'Arizona | La Paz | Mazatlan | Mountain Time (US & Canada) | Yukon', value: 'UTC - 7:00' },
// { name: 'Central America | Central Time (US & Canada) | Easter Island | Guadalajara | Mexico City | Monterrey | Saskatchewan', value: 'UTC - 6:00' },
// { name: 'Bogota | Lima | Quito | Rio Branco | Chetumal | Eastern Time (US & Canada) | Haiti | Havana | East Indiana | Turks | Caicos', value: 'UTC - 5:00' },
// { name: 'Asuncion | Atlantic Time (Canada) | Caracas | Cuiaba | Georgetown | Manaus | San Juan | Santiago', value: 'UTC - 4:00' },
// { name: 'Newfoundland', value: 'UTC - 3:30' },
// { name: 'Araguaine | Brasilia | Cayenne | Fortaleza | City of Buenos Aires | Greenland | Montevideo | Punta Arenas | Punta Arenas | Saint Pierre | Miquelon | Salvador', value: 'UTC - 3:00' },
// { name: 'Coordinated Univeral Time -02', value: 'UTC - 2:00' },
// { name: 'Coordinated Universal Time', value: 'UTC' },
// { name: 'Dublin | Edinburgh | Lisbon | London | Monrovia | Reykjavic | Sao Tome', value: 'UTC + 00:00' },
// { name: 'Casablanca | Amsterdam | Berlin | Bern | Rome | Stockholm | Vienna | Belgrade | Bratislava | Budapest | Ljubljana | Prague | Brussels | Copenhagen | Madrid | Paris | Sarajevo | Skopje | Warsaw | Zagreb | West Central Africa', value: 'UTC + 1:00' },
// { name: 'Athens | Bucharest | Beirut | Cairo | Chisinau | Damascus | Gaza | Hebron | Harare | Pretoria | Helsinki | Kyiv | Riga | Sofia | Tallinn | Vilnius | Jerusalem | Juba | Kaliningrad | Khartoum | Tripoli | Windhoek', value: 'UTC + 2:00' },
// { name: 'Amman | Baghdad | Istanbul | Kuwait | Rijadh | Minsk | Moscow | St. Petersburg | Nairobi | Volgograd', value: 'UTC + 3:00' },
// { name: 'Tehran', value: 'UTC + 3:30' },
// { name: 'Abu Dhabi | Muscat | Astrakhan, Ulyanovsk | Baku | Izhevsk | Samara | Port Louis | Saratov | Tbilisi | Yerevan', value: 'UTC + 4:00' },
// { name: 'Kabul', value: 'UTC + 4:30' },
// { name: 'Ashgabat | Tashkent | Ekaterinburg | Islamabad | Karachi | Qyzylorda', value: 'UTC + 5:00' },
// { name: 'Chennai | Kolkata | Mumbai | New Delhi | Sri Jayawardenepura', value: 'UTC + 5:30' },
// { name: 'Kathmandu', value: 'UTC + 5:45' },
// { name: 'Astana | Dhaka | Omsk', value: 'UTC + 6:00' },
// { name: 'Yangon', value: 'UTC + 6:30' },
// { name: 'Bankok | Hanoi | Jakaria | Barmaul | Gorno-Altaysk | Hovd | Krasnoyarsk | Novosibirsk | Tomsk', value: 'UTC + 7:00' },
// { name: 'Beijing | Chongqing | Hong Kong | Urimqi | Irkutsk | Kuala Lumpur | Singapore | Perth | Taipei | Ulaanbaatar', value: 'UTC + 8:00' },
// { name: 'Eucla', value: 'UTC + 8:45' },
// { name: 'Chita | Osaka | Sapporo | Tokyo | Pyongyang | Seoul | Yakutsk', value: 'UTC + 9:00' },
// { name: 'Adelaide | Darwin', value: 'UTC + 9:30' },
// { name: 'Brisbane | Canberra | Melbourne | Sydney | Guam | Port Moresby | Hobart | Vladivostok', value: 'UTC + 10:00' },
// { name: 'Lord Howe Island', value: 'UTC + 10:30' },
// { name: 'Bougainvill Island | Chokurdakh | Magadan | Norfolk Island | Sakhalin | Solomon Island | New Caledonia', value: 'UTC + 11:00' },
// { name: 'Anadyr | Petropavlovsk-Kamchatsky | Auckland | Wellington | Coordinated Universal Time +12 | Fiji', value: 'UTC + 12:00' },
// { name: 'Chatham Islands', value: 'UTC + 12:45' },
// { name: 'Coordinated Universal Time + 13 | Nuku-alofa | Samoa', value: 'UTC + 3:00' },
// { name: 'Kiritimati Island', value: 'UTC + 14:00' },
//                 )),