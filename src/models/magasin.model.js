module.exports = (sequelize, DataTypes) => {
    var Magasin = sequelize.define('magasin', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nom: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        adresse: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        tel: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                msg: 'cette adresse e-mail est déjà associée à un compte.'
            },
            validate: {
                isEmail: true,
                notEmpty: { msg: 'Le champ email adresse ne peut pas être vide.' },
                notNull: { msg: 'Le champ email adresse est une propriété requise.' }
            },
        },

        Ouvert: {
            type: DataTypes.STRING,
            allowNull: false,

        },
        HeureOuverture: {
            type: DataTypes.TIME,
            allowNull: false,

        },
        HeureFermeture: {
            type: DataTypes.TIME,
            allowNull: false,

        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        }

    });

    return Magasin;
};