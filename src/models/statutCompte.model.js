module.exports = (sequelize, DataTypes) => {
    var Statutcompt = sequelize.define('statutcompt', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nom: {
            type: DataTypes.STRING,
        }
        
    });
   /*  Statutcompt.associate =function (models) {
        Statutcompt.hasMany(models.User);

    } */
    return Statutcompt;
};