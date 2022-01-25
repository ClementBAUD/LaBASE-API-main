module.exports = (sequelize, DataTypes) => {
    var ligneCommande = sequelize.define('lignecommande', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        quantite: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
        
    });
  
    return ligneCommande;
};