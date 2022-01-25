module.exports = (sequelize, DataTypes) => {
    var Profil = sequelize.define('profil', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nom: {
            type: DataTypes.STRING,
        },
        


    });
    
    return Profil;
};