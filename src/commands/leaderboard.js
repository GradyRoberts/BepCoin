const { SlashCommandBuilder } = require('@discordjs/builders');
const { User } = require('../database/db-objects');
const sequelize = require('../database/db-connect');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('See who has the biggest BepCoin stack!'),

    async execute(interaction) {
        const topUsersRaw = await User.findAll({ order: [['balance', 'DESC']], limit: 5 });
        
        const topUsers = [];
        for (let i = 0; i < topUsersRaw.length; i++) {
            const user = await interaction.guild.members.fetch(topUsersRaw[i].userId);
            const name = user.nickname || user.username;
            const stack = topUsersRaw[i].balance;
            topUsers.push([name, stack]);
        }

        let response = '~ BepCoin Leaderboard ~';
        for (let i = 0; i < topUsers.length; i++) {
            response += `\n${i+1}: **${topUsers[i][0]}** - ${topUsers[i][1]} :coin:`;
        }
        await interaction.reply({content: response, ephemeral: true});
    },
};