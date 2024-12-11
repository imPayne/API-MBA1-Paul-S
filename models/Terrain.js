const { DataTypes } = require("sequelize");
const sequelize = require("../config/init");

const Terrain = sequelize.define('Terrain', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,  // Changer CHAR(1) en STRING pour permettre plus de caractères
        allowNull: false,
        unique: true,
    },
    is_available: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
}, {
    tableName: 'terrains',
    timestamps: false,
});

module.exports = Terrain;