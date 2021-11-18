/*
 * Create the tables in the database. Only needs to be run once unless schema changes
 */
const Sequelize = require('sequelize');

const sequelize = new Sequelize('BepCoin', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite',
});

const User = require('./models/user.model')(sequelize, Sequelize.DataTypes);
const Bet = require('./models/bet.model')(sequelize, Sequelize.DataTypes);
const Prop = require('./models/prop.model')(sequelize, Sequelize.DataTypes);

// Users can place multiple bets
// Each bet is placed by one user
Bet.belongsTo(User); // fk='UserUserId'
User.hasMany(Bet);

// Props can contain multiple bets
// Each bet applies to one prop
Bet.belongsTo(Prop); // fk='PropPropId'
Prop.hasMany(Bet);

// Users can create many props
// Each prop is created by one user
Prop.belongsTo(User); // fk='UserUserId'
User.hasMany(Prop);

sequelize.sync({ force: true }).catch(console.error);