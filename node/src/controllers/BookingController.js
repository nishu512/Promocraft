const bookingModel = require("../models/BookingModel");
const HordingModel = require("../models/HordingModel");
const multer = require("multer");
const path = require("path");
const cloudinaryUtil = require("../utils/CloudanryUtil");
const Razorpay = require('razorpay');

// Initialize Razorpay instance
const razorpayInstance = new Razorpay({
  key_id: '', // Replace with your Razorpay key_id
  key_secret: '', // Replace with your Razorpay key_secret
});

// Payment initiation function
const initiatePayment = async (req, res) => {
  const bookingId = req.params.id;

  try {
    // Fetch the booking to get total cost
    const booking = await bookingModel.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    // Create a new Razorpay order
    const options = {
      amount: booking.Total_Cost * 100, // Razorpay amount is in paise, so multiply by 100
      currency: "INR",
      receipt: `receipt_${bookingId}`,
      payment_capture: 1, // Auto-capture payment
    };
    const order = await razorpayInstance.orders.create(options);
    // Send order ID to the frontend to proceed with payment
    res.status(200).json({
      message: "Order created successfully",
      orderId: order.id,
      amount: options.amount,
      currency: options.currency,
      bookingId: bookingId,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error initiating payment", error: err });
  }
};


// Capture payment and update status
const capturePayment = async (req, res) => {
  const { payment_id, order_id, bookingId } = req.body;

  try {
    // Update booking payment status
    const updatedBooking = await bookingModel.findByIdAndUpdate(
      bookingId,
      { Payment_Status: 'paid' },
      { new: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({
      message: "Payment captured and booking updated",
      data: updatedBooking,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error capturing payment", error: err });
  }
};
const storage = multer.diskStorage({
  destination: "./uploads",
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
  //fileFilter:
}).single("addBannerUrl");

// Add Booking
const addBooking = async (req, res) => {
  try {
    const newBooking = await bookingModel.create(req.body);
    res.status(201).json({
      message: "Booking added successfully",
      data: newBooking,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error adding booking",
      error: err,
    });
  }
};
// Get All Bookings
const getAllBookings = async (req, res) => {
  try {
    const bookings = await bookingModel.find()
      .populate("userId", "firstName lastName email") // Populate user details
      .populate("hordingId"); // Populate hoarding details
    
    res.status(200).json({
      message: "Bookings fetched successfully",
      data: bookings,
    });
  } 
  catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error fetching bookings",
      error: err,
    });
  }
};
const addBookingWithFile = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.log(err);
      res.status(500).json({
        message: err.message,
      });
    } else {
      try {
        // Upload the file to Cloudinary
        const cloundinaryResponse = await cloudinaryUtil.uploadFileToCloudinary(req.file);
        console.log(cloundinaryResponse);
        console.log(req.body);

        // Store the file URL and other booking data in the database
        req.body.addBannerUrl = cloundinaryResponse.secure_url; // Adjust based on what field name you want for file URL

        const newBooking = await bookingModel.create(req.body);

        res.status(201).json({
          message: "Booking with file added successfully",
          data: newBooking,
        });
      } catch (err) {
        console.error(err);
        res.status(500).json({
          message: "Error adding booking with file",
          error: err,
        });
      }
    }
  });
};
// Get Booking By ID
const getBookingById = async (req, res) => {
  try {
    const booking = await bookingModel.findById(req.params.id)
      .populate("userId", "firstName lastName email")
      .populate("hordingId");
    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }
    res.status(200).json({
      message: "Booking fetched successfully",
      data: booking,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error fetching booking",
      error: err,
    });
  }
};
// Update Booking By ID
const updateBookingById = async (req, res) => {
  try {
    const updatedBooking = await bookingModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedBooking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }
    res.status(200).json({
      message: "Booking updated successfully",
      data: updatedBooking,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error updating booking",
      error: err,
    });
  }
};
// Delete Booking By ID
const deleteBookingById = async (req, res) => {
  try {
    const deletedBooking = await bookingModel.findByIdAndDelete(req.params.id);
    if (!deletedBooking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }
    res.status(200).json({
      message: "Booking deleted successfully",
      data: deletedBooking,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error deleting booking",
      error: err,
    });
  }
};
// Get Bookings By User ID
const getBookingsByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const bookings = await bookingModel.find({ userId: userId })
      .populate("userId", "firstName lastName email")
      .populate("hordingId");
      
    if (!bookings || bookings.length === 0) {
      return res.status(404).json({
        message: "No bookings found for this user",
      });
    }

    res.status(200).json({
      message: "Bookings fetched successfully for user",
      data: bookings,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error fetching bookings for user",
      error: err,
    });
  }
};
// Update Booking Status By ID
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status. Status must be 'pending', 'approved', or 'rejected'.",
      });
    }

    const updatedBooking = await bookingModel.findByIdAndUpdate(
      req.params.id,
      { Status: status },
      { new: true }
    );
    if (!updatedBooking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    res.status(200).json({
      message: "Booking status updated successfully",
      data: updatedBooking,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error updating booking status",
      error: err,
    });
  }
};

const addReviewToBooking = async (req, res) => {
  const { bookingId } = req.params;
  const { rating, comment } = req.body;

  // Validate rating and comment
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Rating must be between 1 and 5" });
  }
  if (comment && comment.length > 500) {
    return res.status(400).json({ message: "Comment must be less than 500 characters" });
  }

  try {
    // Find the booking by bookingId
    const booking = await bookingModel.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if the booking already has a review, if so, update it
    if (booking.review) {
      booking.review.rating = rating;
      booking.review.comment = comment;
    } else {
      // If no review exists, add the review
      booking.review = { rating, comment };
    }

    // Save the updated booking
    const updatedBooking = await booking.save();

    res.status(200).json({
      message: "Review added/updated successfully",
      data: updatedBooking,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error adding/updating review",
      error: err,
    });
  }
};

// Update Payment Status By Booking ID

// Update Payment Status By Booking ID
const updatePaymentStatus = async (req, res) => {
  try {
    const payment_status = req.body.payment_status || req.body.Payment_Status;

    console.log("Received Request Body:", req.body);
    console.log("Received Payment Status:", payment_status);
    console.log("Type of Payment Status:", typeof payment_status);
    console.log("Booking ID Received:", req.params.bookingId);

    // Ensure payment_status is a string and trim it
    if (!payment_status) {
      return res.status(400).json({ message: "Payment status is required" });
    }

    const normalizedStatus = String(payment_status).toLowerCase().trim();
    const validStatuses = ["pending", "paid", "failed"];

    if (!validStatuses.includes(normalizedStatus)) {
      return res.status(400).json({
        message: "Invalid payment status. Allowed values: 'pending', 'paid', 'failed'."
      });
    }

    // Ensure bookingId is valid
    if (!req.params.bookingId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid booking ID format" });
    }

    const updatedBooking = await bookingModel.findByIdAndUpdate(
      req.params.bookingId,
      { Payment_Status: normalizedStatus },
      { new: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({
      message: "Payment status updated successfully",
      data: updatedBooking
    });
  } catch (err) {
    console.error("Error updating payment status:", err);
    res.status(500).json({
      message: "Error updating payment status",
      error: err.message
    });
  }
};



module.exports = {
  addBooking,
  getAllBookings,
  getBookingById,
  updateBookingById,
  deleteBookingById,
  addBookingWithFile,
  getBookingsByUserId,
  updateBookingStatus, 
  initiatePayment,
  capturePayment,
  updatePaymentStatus,
  addReviewToBooking,
};
