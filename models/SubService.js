const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const SubService = sequelize.define('SubService', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    duration: {
        type: DataTypes.INTEGER, // in minutes
        allowNull: false
    },
    availableSlots: {
        type: DataTypes.JSON, // Stores array of strings ["09:00", "10:00"]
        allowNull: true
    }
});

module.exports = SubService;
