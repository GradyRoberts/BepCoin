const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('place-bet')
        .setDescription('Place a wager on an open bet!'),
    async execute(interaction) {
        await interaction.reply('Pong!');
    },
};