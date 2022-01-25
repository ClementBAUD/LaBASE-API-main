const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
    var User = sequelize.define('user', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nom: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [1, 70],
                    msg: 'Le champ du nom doit contenir entre 1 et 70 caractères.'
                },
                notEmpty: { msg: 'Le champ nom ne peut pas être vide.' },
                notNull: { msg: 'Le champ nom est une propriété requise.' }
            }
        },
        prenom: {
            type: DataTypes.STRING,
            allowNull: true,  
        },
        adresse: {
            type: DataTypes.STRING,
            allowNull: true,
            
        },
        certi_scolarite: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        avatar: {
            type: DataTypes.STRING,
            allowNull: true,
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
        password: {
            type: DataTypes.STRING,
            allowNull: false,

        },
        dateExp: {
            type: DataTypes.STRING,
            allowNull: true,

        },
        tel:{
            type: DataTypes.STRING,
            allowNull: true,
        }

    });

   /*  User.associate = function (models) {
        User.belongsTo(models.Statutcompt, {
            foreignKey: "StatutcomptId",
            as: "Statutcompts",
        });
    } */
    return User;
};