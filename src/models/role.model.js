module.exports = (sequelize, DataTypes) => {
    var Roles = sequelize.define('role', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            libelle: {
                type: DataTypes.STRING,
            },
            route: {
                type: DataTypes.STRING,
            },
            protocol: {
                type: DataTypes.STRING,
            },

    });
    //Role.belongsToMany(Profil, {through: 'profil_roles',foreignKey: 'roleId',otherKey: 'profilId',});

    return Roles;
};