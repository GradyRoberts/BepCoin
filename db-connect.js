const Sequelize = require('sequelize');
const { dbPassword } = require('./config.json');

const sequelize = new Sequelize('BepCoin', 'user', dbPassword, {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite',
});

module.exports = sequelize;