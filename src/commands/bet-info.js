const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bet-info')
        .setDescription('Get information about a bet!'),
    async execute(interaction) {
        await interaction.reply('Pong!');
    },
};