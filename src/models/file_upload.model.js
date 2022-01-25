module.exports = (sequelize, DataTypes) => {
    var file_upload = sequelize.define('file_upload', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        fileName: {type: DataTypes.STRING, allowNull: false},
        filePath: {type: DataTypes.STRING, allowNull: false},
        originalName: {type: DataTypes.STRING, allowNull: false},
        fileSize: {type: DataTypes.INTEGER, allowNull: false},

    });

    return file_upload;
};