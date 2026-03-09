const { Booking, TimeSlot, SubService } = require('../models');
const { Op } = require('sequelize');

const getBusinessHoursForDate = (dateString) => {
    const day = new Date(`${dateString}T00:00:00`).getDay(); // 0=Sun,1=Mon,...6=Sat

    // Monday closed
    if (day === 1) {
        return null;
    }

    // Tue-Fri: 09:00 - 20:00
    if (day >= 2 && day <= 5) {
        return { start: '09:00:00', end: '20:00:00' };
    }

    // Sat/Sun: 10:00 - 20:00
    return { start: '10:00:00', end: '20:00:00' };
};

exports.getAvailableSlots = async (req, res) => {
    try {
        const { date, subServiceId } = req.query;

        if (!date || !subServiceId) {
            return res.status(400).json({ message: "Date and subServiceId are required" });
        }

        const subService = await SubService.findByPk(subServiceId);
        if (!subService) return res.status(404).json({ message: "Sub service not found" });

        const duration = subService.duration; // minutes
        const slots = [];

        // Define business hours by day
        const hours = getBusinessHoursForDate(date);
        if (!hours) {
            // Monday is closed
            return res.json([]);
        }

        let currentTime = new Date(`${date}T${hours.start}`);
        const endTime = new Date(`${date}T${hours.end}`);

        const startOfDay = new Date(`${date}T00:00:00`);
        const endOfDay = new Date(`${date}T23:59:59`);

        // Check TimeSlot table DIRECTLY for ANY booked slots
        // This is safer than checking Booking table
        const bookedSlots = await TimeSlot.findAll({
            where: {
                datetime: {
                    [Op.between]: [startOfDay, endOfDay]
                },
                subServiceId: subServiceId,
                isBooked: true
            }
        });

        const bookedTimes = bookedSlots.map(slot => {
            const dt = new Date(slot.datetime);
            const hours = String(dt.getHours()).padStart(2, '0');
            const minutes = String(dt.getMinutes()).padStart(2, '0');
            return `${hours}:${minutes}`;
        });

        console.log(`[Slots Check] Date: ${date}, SubID: ${subServiceId}, Booked:`, bookedTimes);

        // Always generate slots from business hours by weekday:
        // Mon closed, Tue-Fri 09:00-20:00, Sat-Sun 10:00-20:00.
        while (currentTime.getTime() + duration * 60000 <= endTime.getTime()) {
            const hours = String(currentTime.getHours()).padStart(2, '0');
            const minutes = String(currentTime.getMinutes()).padStart(2, '0');
            const timeString = `${hours}:${minutes}`;

            const isBooked = bookedTimes.includes(timeString);

            if (!isBooked) {
                slots.push({
                    time: timeString,
                    available: true
                });
            }

            currentTime = new Date(currentTime.getTime() + duration * 60000);
        }

        res.json(slots);
    } catch (error) {
        console.error("Slot fetch error:", error);
        res.status(500).json({ message: error.message });
    }
};

const sendEmail = require('../utils/sendEmail');

exports.createBooking = async (req, res) => {
    try {
        const { customerName, customerEmail, customerPhone, subServiceId, date, time, paymentStatus, transactionId } = req.body;

        const datetime = new Date(`${date}T${time}:00`);
        const subService = await SubService.findByPk(subServiceId);

        // Create TimeSlot
        const timeSlot = await TimeSlot.create({
            datetime: datetime,
            isBooked: true,
            subServiceId
        });

        const booking = await Booking.create({
            customerName,
            customerEmail,
            customerPhone,
            subServiceId,
            timeSlotId: timeSlot.id,
            paymentStatus: paymentStatus || 'pending',
            transactionId: transactionId || null
        });

        // Send Email Notification
        const emailContent = `
            <h1>Booking Confirmation</h1>
            <p>Dear ${customerName},</p>
            <p>Your appointment for <strong>${subService ? subService.title : 'Service'}</strong> is confirmed.</p>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Time:</strong> ${time}</p>
            <p>Thank you for choosing LuxeSalon!</p>
        `;

        // Send async (don't await to speed up response)
        sendEmail(customerEmail, 'Appointment Confirmation - LuxeSalon', emailContent);
        // Notify Admin
        const adminEmail = 'Hx23xxxx@gmail.com';
        sendEmail(adminEmail, 'New Booking Received', `<p>New booking from ${customerName} for ${date} at ${time}.</p>`);

        res.status(201).json({ bookingId: booking.id, message: "Booking initialized and email sent" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.findAll({
            include: [{ model: TimeSlot }, { model: SubService }],
            order: [['createdAt', 'DESC']]
        });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // 'confirmed', 'cancelled', 'pending'

        const booking = await Booking.findByPk(id);
        if (!booking) return res.status(404).json({ message: "Booking not found" });

        booking.paymentStatus = status;
        await booking.save();

        // If cancelled, free up the slot? 
        // For now, we keep the slot booked record but maybe update isBooked logic if requested.
        // Complex logic: if cancelled, we should set TimeSlot.isBooked = false.
        if (status === 'cancelled') {
            const slot = await TimeSlot.findByPk(booking.timeSlotId);
            if (slot) {
                slot.isBooked = false;
                await slot.save();
            }
        }

        res.json({ message: `Booking updated to ${status}` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
