const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const TimeSlot = sequelize.define('TimeSlot', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    datetime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    isBooked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});

module.exports = TimeSlot;
