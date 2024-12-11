const { DataTypes } = require("sequelize");
const sequelize = require("../config/init");

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING(255),
        defaultValue: false,
        allowNull: true,
    },
    is_admin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
    },
}, {
    tableName: 'users',
    timestamps: true,  // Sequelize ajoutera automatiquement `createdAt` et `updatedAt`
});

module.exports = User;