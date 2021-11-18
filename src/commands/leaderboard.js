const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('See who has the biggest BepCoin stack!'),
    async execute(interaction) {
        await interaction.reply('Pong!');
    },
};