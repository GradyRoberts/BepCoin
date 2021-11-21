const { SlashCommandBuilder } = require('@discordjs/builders');
const { User } = require('../database/db-objects');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription('View your Bepcoin balance and daily login streak!'),
        
    async execute(interaction) {
        const uid = interaction.user.id;
        const uname = interaction.user.username;
        const [user, _created] = await User.findOrCreate({
            where: { userId: uid },
            attributes: ['balance', 'loginStreak']
        });
        await interaction.reply({
            content: `${uname}, your current BepCoin balance is **${user.balance}** :coin: and you have a login streak of **${user.loginStreak} days**!\n\n*You can earn \`250 + 50 \* streak\` coins per day by joining voice call*`,
            ephemeral: true
        });
    },
};