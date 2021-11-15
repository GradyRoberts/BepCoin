/*
 * Create the tables in the database. Only needs to be run once unless schema changes.
 */
const Sequelize = require('sequelize');

const sequelize = new Sequelize('BepCoin', 'user', dbPassword, {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite',
});

require('./models/user.model')(sequelize, Sequelize.DataTypes);
require('./models/bet.model')(sequelize, Sequelize.DataTypes);
require('./models/prop.model')(sequelize, Sequelize.DataTypes);

const force = process.argv.includes('--force') || process.argv.includes('-f');

sequelize.sync({ force }).catch(console.error);
sequelize.close();