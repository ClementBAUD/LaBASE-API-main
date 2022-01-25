module.exports = (sequelize, DataTypes) => {
    var MiseADispo = sequelize.define('miseadispo', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        libelle: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        quantiteInit: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        quantiteActuel: {
            type: DataTypes.INTEGER,
            allowNull: false,

        }
        ,
        imageProduit: {
            type: DataTypes.STRING,
            allowNull: true,

        }
        ,
        familleProduit: {
            type: DataTypes.STRING,
            allowNull: true,

        }
        ,
        date: {
            type: DataTypes.STRING,
            allowNull: false,

        }
        
        
    });

    return MiseADispo;
};