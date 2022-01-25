module.exports = (sequelize, DataTypes) => {
    var Produit = sequelize.define('produit', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        titre: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        titre_commercial: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        plu: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        image: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        ingredient: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        allergene: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        valeurNutritionnelle: {
            type: DataTypes.TEXT,
            allowNull: true,
        }

    }, {
        indexes:[
            {
                unique:true,
                fields:['plu']

            }
        ]
    });


    return Produit;
};