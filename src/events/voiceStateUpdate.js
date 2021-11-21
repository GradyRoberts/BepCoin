const { User } = require('../database/db-objects');
const sequelize = require('../database/db-connect');

const isNewDay = (lastLogin, newLogin) => {
    if (!lastLogin) { return true; }

    return !(lastLogin.getDate() == newLogin.getDate()
        && lastLogin.getMonth() == newLogin.getMonth()
        && lastLogin.getYear() == newLogin.getYear()
    );
};

const isStreakBroken = (lastLogin, newLogin) => {
    if (!lastLogin) { return true; }

    const yesterday = new Date();
    yesterday.setDate(newLogin.getDate()-1);
    return (lastLogin.toLocaleDateString() !== yesterday.toLocaleDateString());
};

module.exports = {
    name: 'voiceStateUpdate',
    async execute(oldState, newState) {
        if (oldState.channelId === null && newState.channelId !== null) {
            console.log(`${newState.member.displayName} joined!`);

            const userId = newState.member.id;
            const [user, _created] = await User.findOrCreate({ where: { userId: userId } });

            const lastLogin = new Date(user.lastLogin);
            const newLogin = new Date(Date.now());
            if (isNewDay(lastLogin, newLogin)) {
                const oldStreak = user.loginStreak;
                let newStreak;
                if (isStreakBroken(lastLogin, newLogin)) {
                    newStreak = 1;
                } else {
                    newStreak = oldStreak + 1;
                }
                const oldBalance = user.balance;
                const newBalance = oldBalance + 250 + (50 * newStreak);
                console.log(`\t${newState.member.displayName} just earned ${newBalance - oldBalance} with a streak of ${newStreak}!`)
                await user.update({ lastLogin: newLogin, loginStreak: newStreak, balance: newBalance });
            } else {
                await user.update({ lastLogin: newLogin });
            }
        } else if (oldState.channelId !== null && newState.channelId === null) {
            console.log(`${oldState.member.displayName} left!`);
        }
    }
}