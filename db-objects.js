/*
 * Create the associations between database models
 */
const Sequelize = require('sequelize');
const sequelize = require('./db-connect');

const User = require('./models/user.model')(sequelize, Sequelize.DataTypes);
const Bet = require('./models/bet.model')(sequelize, Sequelize.DataTypes);
const Prop = require('./models/prop.model')(sequelize, Sequelize.DataTypes);

// Users can place multiple bets
// Each bet is placed by one user
Bet.belongsTo(User);
User.hasMany(Bet);

// Props can contain multiple bets
// Each bet applies to one prop
Bet.belongsTo(Prop);
Prop.hasMany(Bet);

module.exports = { User, Bet, Prop };