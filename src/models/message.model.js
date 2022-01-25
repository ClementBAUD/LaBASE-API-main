module.exports = (sequelize, DataTypes) => {
    var message = sequelize.define('message', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        iduser: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        idmag: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        messages: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        nomuser: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        nomMagasin: {
            type: DataTypes.STRING,
            allowNull: false,
        }
        ,
        statut: {
            type: DataTypes.STRING,
            allowNull: false,
        }
        
    });

    return message;
};