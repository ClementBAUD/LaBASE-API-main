 /**
  * relation entre client et magasin  
  *  
  */
 module.exports = (sequelize, DataTypes) => {
     const User_Magasin = sequelize.define('user_magasin', {
         UserId: {
             type: DataTypes.INTEGER,
             field: 'userId'
         },
         MagasinId: {
             type: DataTypes.INTEGER,
             field: 'magasinId'
         },
         createdAt: {
             type: DataTypes.DATE,
             allowNull: false,
             defaultValue: new Date(),
             field: 'created_at'
         },
     }, {
         tableName: 'user_magasins',
         timestamps: false,
     });

     return User_Magasin;
 };