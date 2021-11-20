const { SlashCommandBuilder } = require('@discordjs/builders');
const { User } = require('../database/db-objects');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('open-bet')
        .setDescription('Open a new bet!')
        .addStringOption(option =>
            option.setName('question')
                .setDescription('The prompt for the bet, must have a yes/no answer')
                .setRequired(true))
        .addNumberOption(option =>
            option.setName('time_limit')
                .setDescription('How long to accept bets')
                .addChoices([['1 min', 1], ['2 min', 2], ['5 min', 5]])
                .setRequired(true)),
    // .addStringOption(option =>
    //     option.setName('custom_yes')
    //         .setDescription('Optional alias for yes choice')
    //         .setRequired(false))
    // .addStringOption(option =>
    //     option.setName('custom_no')
    //         .setDescription('Optional alias for no choice')
    //         .setRequired(false)),

    async execute(interaction) {
        const uid = interaction.user.id;
        const uname = interaction.user.username;
        const question = interaction.options.getString('question');
        // const yesAlias = interaction.options.getString('custom_yes') || 'Yes';
        // const noAlias = interaction.options.getString('custom_no') || 'No';
        const timeLimit = interaction.options.getNumber('time_limit');
        const closingTime = new Date(Date.now() + timeLimit * 60000);

        const [user, _created] = await User.findOrCreate({ where: { userId: uid } });

        const prop = await user.createProp({
            question: question,
            // yesAlias: yesAlias,
            // noAlias: noAlias,
            openUntil: closingTime
        });

        // #TODO: Create custom embed reply with live totals
        await interaction.reply(`New bet created: **${question}**\nAccepting predictions until **${closingTime.toLocaleTimeString()}**\n\nUse \`/place-bet ${prop.propId} [yes/no] [amount]\` to wager your BepCoin!\n${uname}, use \`/close-bet ${prop.propId} [yes/no]\` to close the bet and pay out the winners!`);
    },
};