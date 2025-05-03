import React, { useEffect, useState } from "react";
import "./MyBooking.css";
import logo from "./logo.jpg";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddReview = () => {
  const [bookingData, setBookingData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [filterArea, setFilterArea] = useState("");
  const [reviewData, setReviewData] = useState({ rating: 0, comment: "" });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const userId = localStorage.getItem("id");

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, filterCity, filterArea, bookingData]);

  const fetchHordingDetails = async (hordingId) => {
    try {
      const response = await fetch(`http://localhost:3000/hording/getHordingById/${hordingId}`);
      const result = await response.json();
      return result.data || null;
    } catch (error) {
      console.error("Error fetching hoarding details:", error);
      return null;
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await fetch(`http://localhost:3000/bookings/user/${userId}`);
      const result = await response.json();
      if (result.data) {
        const bookingsWithDetails = await Promise.all(
          result.data.map(async (booking) => ({
            ...booking,
            hordingDetails: await fetchHordingDetails(booking.hordingId._id),
          }))
        );
        setBookingData(bookingsWithDetails);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const applyFilters = () => {
    let filtered = [...bookingData];

    if (searchQuery) {
      filtered = filtered.filter((b) =>
        b.hordingDetails?.hoardingType?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterCity) {
      filtered = filtered.filter((b) => b.hordingDetails?.cityId?.name === filterCity);
    }

    if (filterArea) {
      filtered = filtered.filter((b) => b.hordingDetails?.areaId?.name === filterArea);
    }

    setFilteredData(filtered);
  };

  const handleDelete = async (bookingId) => {
    try {
      const response = await fetch(`http://localhost:3000/booking/${bookingId}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (response.ok && result.success) {
        setBookingData((prevData) => prevData.filter((booking) => booking._id !== bookingId));
        toast.success("Booking deleted successfully!");
      } else {
        toast.error("Error deleting booking.");
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
      toast.error("Error deleting booking.");
    }
  };

  // Handle rating change
  const handleRatingChange = (e) => {
    setReviewData({ ...reviewData, rating: parseInt(e.target.value) });
  };

  // Handle comment change
  const handleCommentChange = (e) => {
    setReviewData({ ...reviewData, comment: e.target.value });
  };

  // Submit the review
  const handleReviewSubmit = async () => {
    if (reviewData.rating === 0 || reviewData.comment === "") {
      toast.error("Please provide a rating and a comment.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/booking/${selectedBookingId}/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating: reviewData.rating,
          comment: reviewData.comment,
        }),
      });
      const result = await response.json();

      if (response.ok && result.message === "Review added/updated successfully") {
        toast.success("Review added successfully!");
        setShowReviewForm(false);
        setReviewData({ rating: 0, comment: "" });
        fetchBookings(); // Refresh the booking data
      } else {
        toast.error("Failed to add review.");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Error submitting review.");
    }
  };

  // ⭐ STAR RENDER FUNCTION
  const renderStars = (rating) => {
    const totalStars = 5;
    return (
      <div className="star-rating" style={{ display: "flex", alignItems: "center", marginLeft: "20px" }}>
        <strong style={{ marginRight: "8px" }}>Rating:</strong>
        {[...Array(totalStars)].map((_, index) => (
          <span
            key={index}
            style={{
              color: index < rating ? "#FFD700" : "#ccc",
              fontSize: "18px",
              marginRight: "2px",
            }}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <motion.div
      className="my-booking-container"
      initial={{ backgroundPosition: "0% 50%" }}
      animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
    >
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="booking-card-grid">
        {filteredData.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          filteredData.map((booking) => (
            <motion.div
              className="booking-card"
              key={booking._id}
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <img src={booking.addBannerUrl} alt="Banner" className="booking-banner" />
              <p><strong>Hoarding Type:</strong> {booking.hordingDetails?.hoardingType}</p>
              <p><strong>City:</strong> {booking.hordingDetails?.cityId?.name}</p>
              <p><strong>Area:</strong> {booking.hordingDetails?.areaId?.name}</p>
              <p><strong>Start:</strong> {new Date(booking.Start_Time).toLocaleString()}</p>
              <p><strong>End:</strong> {new Date(booking.End_Time).toLocaleString()}</p>
              <p><strong>Total cost:</strong> ₹{booking.Total_Cost.toLocaleString()}</p>
              <p><strong>Status:</strong> {booking.Status}</p>
              <p><strong>Payment:</strong> {booking.Payment_Status}</p>

              {/* ⭐ Rating display using stars */}
              {typeof booking.review?.rating === "number" && (
                <div>{renderStars(booking.review.rating)}</div>
              )}

              {/* 💬 Comment */}
              {booking.review?.comment && <p><strong>Comment:</strong> {booking.review.comment}</p>}

              <div className="booking-actions">
                <button className="delete-btn" onClick={() => handleDelete(booking._id)}>
                  Delete Booking
                </button>
                <button
                  className="add-review-btn"
                  onClick={() => {
                    setShowReviewForm(true);
                    setSelectedBookingId(booking._id);
                  }}
                >
                  Add Review
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Add Review Modal (Pop-up form) */}
      {showReviewForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Leave a Review</h3>
            <div className="star-rating-form">
              <strong>Rating: </strong>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  style={{
                    color: star <= reviewData.rating ? "#FFD700" : "#ccc",
                    fontSize: "64px",
                    cursor: "pointer",
                  }}
                  onClick={() => setReviewData({ ...reviewData, rating: star })}
                >
                  ★
                </span>
              ))}
            </div>
            <textarea
              placeholder="Write a comment"
              value={reviewData.comment}
              onChange={handleCommentChange}
            ></textarea>
            <div class="button-group">

            <button onClick={handleReviewSubmit}>Submit Review</button>
            <button onClick={() => setShowReviewForm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AddReview;
