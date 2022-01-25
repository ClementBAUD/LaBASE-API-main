module.exports = (sequelize, DataTypes) => {
    var commande = sequelize.define('commande', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        NumCom:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        heureRecuperation:{
            type: DataTypes.STRING,
            allowNull: true,
        }
        
        

        
    });
  
    return commande;
};