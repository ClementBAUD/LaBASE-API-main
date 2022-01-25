module.exports = (sequelize, DataTypes) => {
    var parametre = sequelize.define('parametre', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nom: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
        }
        
    });

    return parametre;
};