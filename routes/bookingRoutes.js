const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

const verifyToken = require('../middleware/authMiddleware');

// ────────────────────────────────────────────────
// Existing routes
router.post('/', bookingController.createBooking);
router.get('/', verifyToken, bookingController.getAllBookings);
router.put('/:id', verifyToken, bookingController.updateBookingStatus); // Admin update status

// ────────────────────────────────────────────────
// NEW: Get available time slots for a specific date and sub-service
// Example: GET /bookings/slots?date=2026-01-15&subServiceId=2
router.get('/slots', bookingController.getAvailableSlots);

module.exports = router;