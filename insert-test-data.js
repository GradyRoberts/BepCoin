const { User, Bet } = require('./db-objects');

const u1 = await User.create({ userId: '163032275074678784', lastLogin: '2021-11-17 23:59:59', loginStreak: 0, coinCount: 150 });
const p1 = await u1.createProp({ propId: 'prop1', userId: u1.userId, question: 'will nl get 6 wins or more?', openUntil: '2021-11-18 12:00:00' });
await Bet.createBet({ betId: 'bet1', propId: p1.propId, userId: u1.propId, prediction: 1, wager: 25 });