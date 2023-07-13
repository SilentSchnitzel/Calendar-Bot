const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('View tips for using Calendar Bot'),
    async execute(interaction) {
        const directories = [
            ...new Set(interaction.client.commands.map((cmd) => cmd.folder)),
        ];
        const formatString = (str) => {
            const newStr = String(str);
            `${newStr[0].toUpperCase()}${newStr.slice(1).toLowerCase()}`;
        }

        const categories = directories.map((dir) => {
            const getCommands = interaction.client.commands
                .filter((cmd) => cmd.folder === dir)
                .map((cmd) => {
                    return {
                        name: cmd.data.name,
                        description: cmd.data.description || 'This command has no description',
                    };
                });
            return {
                directory: formatString(dir),
                commands: getCommands,
            }
        });
        // \n means new line
        const embed = new EmbedBuilder()
            .setTitle('Calender Bot Help')
            .setDescription("I make setting reminders and organizing events easier.\n" +
                "For more information about the bot run the `/info` command.\n" +
                "Some example uses of commands can be viewed below"
            )
            .setColor(0x0099ff)
            .addFields({ name: 'Examples', value: 'foo' });


        await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};
