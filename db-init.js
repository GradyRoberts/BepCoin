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

require('./models/user.model')(sequelize, Sequelize.DataTypes);
require('./models/bet.model')(sequelize, Sequelize.DataTypes);
require('./models/prop.model')(sequelize, Sequelize.DataTypes);

sequelize.sync().catch(console.error);