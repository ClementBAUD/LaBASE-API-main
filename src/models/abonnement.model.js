module.exports = (sequelize, DataTypes) => {
    var abonnement = sequelize.define('abonnement', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        sub:{
            type: DataTypes.STRING,
            allowNull: true,
        }
        ,
        device:{
            type: DataTypes.STRING,
            allowNull: true,
        }
        ,
        notif:{
            type: DataTypes.STRING,
            allowNull: true,
        }
        ,idmag:{
            type: DataTypes.STRING,
            allowNull: true,
        },
        statut:{
            type: DataTypes.STRING,
            allowNull: true,
        },
        tel:{
            type: DataTypes.STRING,
            allowNull: true,
        }
    
    });
  
    return abonnement;
};

