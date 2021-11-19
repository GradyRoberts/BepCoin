module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Bet', {
        betId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
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