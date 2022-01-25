module.exports = (sequelize, DataTypes) => {
    var statusDispo = sequelize.define('statusdispo', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nom: {
            type: DataTypes.STRING,
        }

    });

    return statusDispo;
};