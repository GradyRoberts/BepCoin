module.exports = (sequelize, DataTypes) => {
    return sequelize.define('User', {
        userId: {
            type: DataTypes.STRING,
            primaryKey: true,
            unique: true,
            allowNull: false
        },

        lastLogin: DataTypes.DATE,
        loginStreak: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },

        coinCount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    }, {
        timestamp: false
    });
};