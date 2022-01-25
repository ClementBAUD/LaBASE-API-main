module.exports = (sequelize, DataTypes) => {
    var Sous_Famille = sequelize.define('Sous_Famille', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nom: {
            type: DataTypes.STRING,
        },

    });

    return Sous_Famille;
};