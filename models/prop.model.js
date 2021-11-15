module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Prop', {
        propId: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        finished: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        outcome: {
            type: DataTypes.BOOLEAN,
        }
    }, {
        timestamp: false
    });
};