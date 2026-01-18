const sequelize = require('../config/db');
const User = require('./User');
const Service = require('./Service');
const SubService = require('./SubService');
const TimeSlot = require('./TimeSlot');
const Booking = require('./Booking');
const Blog = require('./Blog');
const Gallery = require('./Gallery');

// Relationships
Service.hasMany(SubService, { foreignKey: 'serviceId', onDelete: 'CASCADE' });
SubService.belongsTo(Service, { foreignKey: 'serviceId' });

SubService.hasMany(TimeSlot, { foreignKey: 'subServiceId', onDelete: 'CASCADE' });
TimeSlot.belongsTo(SubService, { foreignKey: 'subServiceId' });

// Booking likely relates to a TimeSlot or SubService directly
// Assuming 1 booking per slot
TimeSlot.hasOne(Booking, { foreignKey: 'timeSlotId' });
Booking.belongsTo(TimeSlot, { foreignKey: 'timeSlotId' });

SubService.hasMany(Booking, { foreignKey: 'subServiceId' });
Booking.belongsTo(SubService, { foreignKey: 'subServiceId' });

module.exports = {
    sequelize,
    User,
    Service,
    SubService,
    TimeSlot,
    Booking,
    Blog,
    Gallery
};
