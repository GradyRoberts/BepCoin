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
            content: `${uname}, your current BepCoin balance is **${user.balance}** :coin: and you have a login streak of **${user.loginStreak} days**!\n\n*Join voice call at least once per day to earn more coins and build your streak*`,
            ephemeral: true
        });
    },
};