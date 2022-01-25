module.exports = (sequelize, DataTypes) => {
    var statutcommande = sequelize.define('statutcommande', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: false
        },
        nom:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        ordre: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
        
    });
  
    return statutcommande;
};