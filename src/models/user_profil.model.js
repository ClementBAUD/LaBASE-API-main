module.exports = (sequelize, DataTypes) => {
    const User_profil = sequelize.define('users_profils', {
        UserId: {
            type: DataTypes.INTEGER,
            field: 'userId'
        },
        ProfilId: {
            type: DataTypes.INTEGER,
            field: 'profilId'
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: new Date(),
            field: 'created_at'
        },
    }, {
        tableName: 'users_profils',
        timestamps: false,
    });

    return User_profil;
};