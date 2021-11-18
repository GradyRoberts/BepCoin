module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Bet', {
        betId: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        prediction: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        wager: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1
            }
        }
    }, {
        timestamps: false
    });
}