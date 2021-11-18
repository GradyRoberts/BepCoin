const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('close-bet')
        .setDescription('Close a bet and pay out winners! Only the bet creator can use this command.'),
    async execute(interaction) {
        await interaction.reply('Pong!');
    },
};