module.exports = (sequelize, DataTypes) => {
    var Familles = sequelize.define('famille', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
           // autoIncrement: true
        },
        nom: {
            type: DataTypes.STRING,
        },

    });

    return Familles;
};