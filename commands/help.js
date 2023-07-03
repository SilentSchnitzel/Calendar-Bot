const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: help = new SlashCommandBuilder()
        .setName('help')
        .setDescription('View tips for using Calendar Bot'),
    async execute (interaction)
    {
        const directories = [
            ...new Set(interaction.client.commands.map((cmd) => cmd.folder)),
        ];
        const formatString = (str) => {
            const newStr = String(str);
            `${newStr[0].toUpperCase()}${newStr.slice(1).toLowerCase()}`;
        }
            

        const wheee = 'bruh please help me';

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
        const embed = new EmbedBuilder()
            .setTitle('Calender Bot Help')
            .setDescription(`
            foo
            `)
            .setColor(0x0099ff)
            

        await interaction.reply({embeds: [embed]});
    },
};
