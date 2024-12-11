const { DataTypes } = require("sequelize");
const sequelize = require("../config/init");

const Terrain = sequelize.define('Terrain', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.CHAR(1),
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