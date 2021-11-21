const { SlashCommandBuilder } = require('@discordjs/builders');
const { User, Prop, Bet } = require('../database/db-objects');
const sequelize = require('../database/db-connect');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('close-bet')
        .setDescription('Close a bet and pay out winners! Only the bet creator can use this command.')
        .addStringOption(option =>
            option.setName('bet_id')
                .setDescription('The ID returned when the bet was created')
                .setRequired(true))
        .addNumberOption(option =>
            option.setName('winner')
                .setDescription('The outcome of the bet')
                .addChoices([['Yes', 1], ['No', 0]])
                .setRequired(true)),

    async execute(interaction) {
        const propId = interaction.options.getString('bet_id');
        const winner = interaction.options.getNumber('winner');
        const loser = winner ? 0 : 1;

        const prop = await Prop.findByPk(propId);
        if (!prop) {
            await interaction.reply({ content: `${uname}, this is an invalid \`betId\``, ephemeral: true });
            return;
        }
        if (prop.finished) {
            await interaction.reply({ content: `${uname}, this bet has been closed already`, ephemeral: true });
            return;
        }
        await prop.update({ finished: true, outcome: winner });

        const loserCoins = await Bet.sum('wager', { where: { propId: propId, prediction: loser } });
        const winnerCoins = await Bet.sum('wager', { where: { propId: propId, prediction: winner } });

        const winningBets = await Bet.findAll({ where: { propId: propId, prediction: winner } });
        // Utilize transaction to ensure balance updates are done atomically for all bettors
        await sequelize.transaction(async (t) => {
            for (let i = 0; i < winningBets.length; i++) {
                const user = await User.findByPk(winningBets[i].userId, { transaction: t });
                const wager = winningBets[i].wager;
                const oldBalance = user.balance;
                const newBalance = oldBalance + wager + Math.ceil((wager / winnerCoins) * loserCoins);
                await user.update({ balance: newBalance }, { transaction: t });
            }
        });

        const winners_str = winner ? 'believers' : 'doubters';
        await interaction.reply(`Bet **"${prop.question}"** has ended, **${winnerCoins + loserCoins} :coin:** go to **${winners_str}**!`);
    },
};