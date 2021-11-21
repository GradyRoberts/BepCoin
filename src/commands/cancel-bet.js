const { SlashCommandBuilder } = require('@discordjs/builders');
const { User, Prop, Bet } = require('../database/db-objects');
const sequelize = require('../database/db-connect');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cancel-bet')
        .setDescription('Close a bet and refund bettors. Only the bet creator can use this command.')
        .addStringOption(option =>
            option.setName('bet_id')
                .setDescription('The ID returned when the bet was created')
                .setRequired(true)),

    async execute(interaction) {
        const uid = interaction.user.id;
        const propId = interaction.options.getString('bet_id');

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
            await interaction.reply({ content: `${uname}, you are not authorized to cancel this bet`, ephemeral: true });
            return;
        }

        await prop.update({ finished: true });

        const bets = await Bet.findAll({ where: { propId: propId } });
        // Utilize transaction to ensure balance updates are done atomically for all bettors
        await sequelize.transaction(async (t) => {
            for (let i = 0; i < bets.length; i++) {
                const user = await User.findByPk(bets[i].userId, { transaction: t });
                const wager = bets[i].wager;
                const oldBalance = user.balance;
                const newBalance = oldBalance + wager;
                await user.update({ balance: newBalance }, { transaction: t });
            }
        });

        await interaction.reply('Pong!');
    },
};