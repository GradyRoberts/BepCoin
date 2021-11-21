const { SlashCommandBuilder } = require('@discordjs/builders');
const { User, Prop, Bet } = require('../database/db-objects');
const sequelize = require('../database/db-connect');

const fetchName = async (interaction, userId) => {
    let name = '';
    try {
        const user = await interaction.guild.members.fetch(userId);
        name = user.displayName;
    } catch {
        name = 'unknown';
    }
    return name;
};

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
        const uid = interaction.user.id;
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

        const user = await User.findByPk(uid);
        if (user.userId !== prop.userId) {
            await interaction.reply({ content: `${uname}, you are not authorized to close this bet`, ephemeral: true });
            return;
        }

        await prop.update({ finished: true, outcome: winner });

        const loserCoins = await Bet.sum('wager', { where: { propId: propId, prediction: loser } });
        const winnerCoins = await Bet.sum('wager', { where: { propId: propId, prediction: winner } });

        const winningBets = await Bet.findAll({ where: { propId: propId, prediction: winner } });
        let gains_str = ``;
        // Utilize transaction to ensure balance updates are done atomically for all bettors
        await sequelize.transaction(async (t) => {
            for (let i = 0; i < winningBets.length; i++) {
                const user = await User.findByPk(winningBets[i].userId, { transaction: t });
                const wager = winningBets[i].wager;
                const oldBalance = user.balance;
                const newBalance = oldBalance + wager + Math.ceil((wager / winnerCoins) * loserCoins);
                await user.update({ balance: newBalance }, { transaction: t });

                const name = await fetchName(interaction, user.userId);
                gains_str += `\n     **${newBalance - oldBalance} :coin: --> ${name}**`;
            }
        });

        const winners_str = winner ? 'believers' : 'doubters';
        await interaction.reply(`Bet **"${prop.question}"** has ended, **${winnerCoins + loserCoins} :coin:** go to **${winners_str}**!${gains_str}`);
    },
};