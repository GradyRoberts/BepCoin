module.exports = (sequelize, DataTypes) => {
    return sequelize.define('User', {
        userId: {
            type: DataTypes.STRING,
            primaryKey: true
        },

        lastLogin: DataTypes.DATE,
        loginStreak: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },

        balance: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1000
        }
    }, {
        timestamps: false
    });
};