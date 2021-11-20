const { SlashCommandBuilder } = require('@discordjs/builders');
const { User } = require('../database/db-objects');
const sequelize = require('../database/db-connect');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('See who has the biggest BepCoin stack!'),

    async execute(interaction) {
        // const topUsersRaw = await User.findAll({ order: [['balance', 'DESC']], limit: 3 });
        // const topUsers = topUsersRaw.map(async (u) => {
        //     const username = await interaction.client.users.fetch(u.userId);
        //     const stack = u.balance;
        //     return [username, stack];
        // });

        // let response = '**BepCoin Leaderboard**';
        // for (let i = 0; i < topUsers.length; i++) {
        //     response += `\n${topUsers[i][0]} - ${topUsers[i][1]}`;
        // }
        // await interaction.reply(response);
        await interaction.reply('Currently unimplemented');
    },
};