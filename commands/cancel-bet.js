const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cancel-bet')
        .setDescription('Close a bet and refund bettors. Only the bet creator can use this command.'),
    async execute(interaction) {
        await interaction.reply('Pong!');
    },
};