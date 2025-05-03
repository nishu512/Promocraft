const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/BookingController");

// Add a new booking
router.post("/booking", bookingController.addBooking);


// Get all bookings
router.get("/bookings", bookingController.getAllBookings);

// Get booking by ID
router.get("/booking/:id", bookingController.getBookingById);

// Update booking by ID
router.put("/booking/:id", bookingController.updateBookingById);

// Delete booking by ID
router.delete("/booking/:id", bookingController.deleteBookingById);

// Add booking with file
router.post('/bookingWithFile', bookingController.addBookingWithFile);

// Route to initiate payment for booking
router.post("/booking/:id/payment", bookingController.initiatePayment);

// Route to capture payment
router.post("/payment/capture", bookingController.capturePayment);

// Update booking status by ID
// Update booking status by ID
router.put("/booking/:id/status", bookingController.updateBookingStatus);

// Get bookings by userId
router.get("/bookings/user/:userId", bookingController.getBookingsByUserId);  // <-- New route

router.post("/booking/:bookingId/review", bookingController.addReviewToBooking);

router.put("/bookings/updatePaymentStatus/:bookingId", bookingController.updatePaymentStatus);

module.exports = router;
