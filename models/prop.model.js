module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Prop', {
        propId: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        question: {
            type: DataTypes.STRING,
            allowNull: false
        },
        yesAlias: {
            type: DataTypes.STRING,
            defaultValue: 'Yes'
        },
        noAlias: {
            type: DataTypes.STRING,
            defaultValue: 'No'
        },
        openUntil: {
            type: DataTypes.DATE,
            allowNull: false
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