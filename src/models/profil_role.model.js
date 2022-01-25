module.exports = (sequelize, DataTypes) => {
    const Profil_Role = sequelize.define('profil_roles', {
        profilId: {
            type: DataTypes.INTEGER,
            field: 'profilId'
        },
        roleId: {
            type: DataTypes.INTEGER,
            field: 'roleId'
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: new Date(),
            field: 'created_at'
        },
    }, {
        tableName: 'profil_roles',
        timestamps: false,
    });
  
    return Profil_Role;
};