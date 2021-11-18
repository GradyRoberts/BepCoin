const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('create-bet')
        .setDescription('Open a new bet!'),
    async execute(interaction) {
        await interaction.reply('Pong!');
    },
};