const { SlashCommandBuilder } = require('@discordjs/builders');
const { Prop, Bet } = require('../database/db-objects');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bet-info')
        .setDescription('Get information about a bet!')
        .addStringOption(option =>
            option.setName('bet_id')
                .setDescription('The ID returned when the bet was created')
                .setRequired(true)),

    async execute(interaction) {
        const uname = interaction.user.username;
        const propId = interaction.options.getString('bet_id');

        const prop = await Prop.findByPk(propId);
        if (!prop) {
            await interaction.reply({ content: `${uname}, this is an invalid \`betId\``, ephemeral: true });
            return;
        }

        const question = prop.question;
        const isOpen = Date.parse(prop.openUntil) > new Date(Date.now()) ? `open, use \`/place-bet ${propId} [yes/no] [amount]\` to bet` : 'closed';

        const believerCoins = await Bet.sum('wager', { where: { propId: propId, prediction: 1 } });
        const doubterCoins = await Bet.sum('wager', { where: { propId: propId, prediction: 0 } });
        
        // #TODO: Add info about user's stake in the bet, if any
        await interaction.reply({ 
            content: `"**${question}**"\nBelievers: **${believerCoins}** :coin:\nDoubters: **${doubterCoins}** :coin:\n\nThis bet is currently ${isOpen}`,
            ephemeral: true
        });
    },
};