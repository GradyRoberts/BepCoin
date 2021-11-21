const { SlashCommandBuilder } = require('@discordjs/builders');
const { User } = require('../database/db-objects');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('See who has the biggest BepCoin stack!'),

    async execute(interaction) {
        const topUsersRaw = await User.findAll({ order: [['balance', 'DESC']], limit: 20 });
        
        const topUsers = [];
        for (let i = 0; i < topUsersRaw.length; i++) {
            try {
                const user = await interaction.guild.members.fetch(topUsersRaw[i].userId);
                const name = user.displayName;
                const stack = topUsersRaw[i].balance;
                topUsers.push([name, stack]);
            } catch {
                // user is from a different server
            }
        }

        let response = '~ BepCoin Leaderboard ~';
        for (let i = 0; i < topUsers.length; i++) {
            response += `\n${i+1}: **${topUsers[i][0]}** - ${topUsers[i][1]} :coin:`;
        }
        await interaction.reply({content: response, ephemeral: true});
    },
};