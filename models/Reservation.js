const { DataTypes } = require("sequelize");
const sequelize = require("../config/init");

const Reservation = sequelize.define('Reservation', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    terrain_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'terrains',
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    reservation_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    reservation_time: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    duration: {
        type: DataTypes.INTEGER,
        defaultValue: 45,
    },
}, {
    tableName: 'reservations',
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['terrain_id', 'reservation_date', 'reservation_time'],
        },
    ],
});

Reservation.associate = (models) => {
    Reservation.belongsTo(models.User, { foreignKey: 'user_id' });
    Reservation.belongsTo(models.Terrain, { foreignKey: 'terrain_id' });
};


module.exports = Reservation;