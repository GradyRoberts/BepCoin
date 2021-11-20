const { User } = require('../database/db-objects');

module.exports = {
    name: 'voiceStateUpdate',
    execute(oldState, newState) {
        if (oldState.channelId === null && newState.channelId !== null) {
            console.log(`${newState.member.displayName} joined!`);
            // #TODO Award BepCoin
        } else if (oldState.channelId !== null && newState.channelId === null)
            console.log(`${oldState.member.displayName} left!`);
    }
}