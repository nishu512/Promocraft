const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  Booking_Id: {
    type: String,
    unique: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  hordingId: {
    type: Schema.Types.ObjectId,
    ref: "Hording",
    required: true,
  },
  Start_Time: {
    type: String,
    required: true,
  },
  End_Time: {
    type: String,
    required: true,
  },
  Total_Cost: {
    type: Number,
    required: true,
  },
  Payment_Status: {
    type: String,
    enum: ["paid", "pending", "failed"],
    required: true,
  },
  AddContent: {
    type: String,
  },
  addBannerUrl: {
    type: String,
  },
  Status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  review: {
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      maxlength: 500,
    },
  },
});

bookingSchema.pre("save", function (next) {
  if (!this.Booking_Id) {
    this.Booking_Id = `BOOK_${new Date().getTime()}`;
  }
  next();
});

module.exports = mongoose.model("bookings", bookingSchema);
