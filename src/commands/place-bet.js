const { SlashCommandBuilder } = require('@discordjs/builders');
const { User, Prop } = require('../database/db-objects');
const sequelize = require('../database/db-connect');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('place-bet')
        .setDescription('Place a wager on an open bet!')
        .addStringOption(option =>
            option.setName('bet_id')
                .setDescription('The ID returned when the bet was created')
                .setRequired(true))
        .addNumberOption(option =>
            option.setName('choice')
                .setDescription('Which outcome will win?')
                .addChoices([['Yes', 1], ['No', 0]])
                .setRequired(true))
        .addNumberOption(option =>
            option.setName('amount')
                .setDescription('How many BepCoin to wager')
                .setRequired(true)),

    async execute(interaction) {
        const uid = interaction.user.id;
        const uname = interaction.user.username;
        const propId = interaction.options.getString('bet_id');
        const choice = interaction.options.getNumber('choice');
        const amount = interaction.options.getNumber('amount');

        const prop = await Prop.findByPk(propId);
        if (!prop) {
            await interaction.reply({ content: `${uname}, this is an invalid \`betId\``, ephemeral: true });
            return;
        }
        if (prop.finished) {
            await interaction.reply({ content: `${uname}, this bet has been closed already`, ephemeral: true });
            return;
        }
        if (Date.parse(prop.openUntil) < new Date(Date.now())) {
            await interaction.reply({ content: `${uname}, betting period has closed`, ephemeral: true });
            return;
        }

        const [user, _created] = await User.findOrCreate({ where: { userId: uid } });
        if (user.balance < amount) {
            await interaction.reply({ content: `${uname}, you do not have enough BepCoin to place this bet`, ephemeral: true });
            return;
        }
        if (amount < 1) {
            await interaction.reply({ content: `${uname}, you must bet 1 or more BepCoin`, ephemeral: true });
            return;
        }

        // Utilize transaction to ensure bet is placed and balance is decremented atomically
        await sequelize.transaction(async (t) => {
            await user.createBet({
                prediction: choice,
                wager: amount,
                propId: propId
            }, { transaction: t });

            const oldBalance = user.balance;
            const newBalance = oldBalance - amount;
            await user.update({ balance: newBalance }, { transaction: t });
        });

        const choice_str = choice ? 'Yes' : 'No';
        await interaction.reply({ content: `${uname}, your **${amount}** :coin: bet on **${choice_str}** has been placed!`, ephemeral: true });
    },
};