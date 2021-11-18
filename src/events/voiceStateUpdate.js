module.exports = {
    name: 'voiceStateUpdate',
    execute(oldState, newState) {
        if (oldState.channelId === null && newState.channelId !== null)
            console.log(`${newState.member.displayName} joined!`);
        else if (oldState.channelId !== null && newState.channelId === null)
            console.log(`${oldState.member.displayName} left!`);
    }
}