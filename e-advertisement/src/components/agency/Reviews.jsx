import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./Reviews.css";

const Reviews = () => {
  const [bookingData, setBookingData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [cityNames, setCityNames] = useState({});
  const [stateNames, setStateNames] = useState({});
  const [areaNames, setAreaNames] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [filterArea, setFilterArea] = useState("");
  const [filterRating, setFilterRating] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const userIdFromLocalStorage = localStorage.getItem("id");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch("http://localhost:3000/bookings/");
      const result = await response.json();
      if (result.data) {
        const userFilteredBookings = result.data.filter(
          (booking) =>
            booking.hordingId &&
            booking.hordingId.userId === userIdFromLocalStorage
        );

        setBookingData(userFilteredBookings);
        setFilteredData(userFilteredBookings);

        const cityIds = [
          ...new Set(userFilteredBookings.map((b) => b.hordingId.cityId)),
        ];
        const stateIds = [
          ...new Set(userFilteredBookings.map((b) => b.hordingId.stateId)),
        ];
        const areaIds = [
          ...new Set(userFilteredBookings.map((b) => b.hordingId.areaId)),
        ];

        cityIds.forEach(fetchCityName);
        stateIds.forEach(fetchStateName);
        areaIds.forEach(fetchAreaName);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const fetchCityName = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/city/getcitybyid/${id}`);
      const data = await res.json();
      if (data.data) {
        setCityNames((prev) => ({ ...prev, [id]: data.data.name }));
      }
    } catch (err) {
      console.error("Error fetching city name:", err);
    }
  };

  const fetchStateName = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/state/state/${id}`);
      const data = await res.json();
      if (data.data) {
        setStateNames((prev) => ({ ...prev, [id]: data.data.name }));
      }
    } catch (err) {
      console.error("Error fetching state name:", err);
    }
  };

  const fetchAreaName = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/area/getareabyid/${id}`);
      const data = await res.json();
      if (data.data) {
        setAreaNames((prev) => ({ ...prev, [id]: data.data.name }));
      }
    } catch (err) {
      console.error("Error fetching area name:", err);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    filterBookings(value, filterCity, filterArea, filterRating);
  };

  const handleFilterCity = (e) => {
    const value = e.target.value;
    setFilterCity(value);
    filterBookings(searchQuery, value, filterArea, filterRating);
  };

  const handleFilterArea = (e) => {
    const value = e.target.value;
    setFilterArea(value);
    filterBookings(searchQuery, filterCity, value, filterRating);
  };

  const handleFilterRating = (e) => {
    const value = e.target.value;
    setFilterRating(value);
    filterBookings(searchQuery, filterCity, filterArea, value);
  };

  const filterBookings = (query, city, area, rating) => {
    const filtered = bookingData.filter((booking) => {
      const type = booking.hordingId?.hoardingType?.toLowerCase() || "";
      const matchesSearch = type.includes(query.toLowerCase());
      const matchesCity = !city || booking.hordingId.cityId === city;
      const matchesArea = !area || booking.hordingId.areaId === area;
      const matchesRating =
        !rating || booking.review?.rating?.toString() === rating;
      return matchesSearch && matchesCity && matchesArea && matchesRating;
    });
    setFilteredData(filtered);
  };

  const handleImageClick = (url) => {
    setImageUrl(url);
    setModalOpen(true);
  };

  const handleDownload = async () => {
    try {
      const res = await fetch(imageUrl);
      const blob = await res.blob();
      const tempLink = document.createElement("a");
      tempLink.href = URL.createObjectURL(blob);
      tempLink.setAttribute("download", imageUrl.split("/").pop());
      tempLink.click();
    } catch (err) {
      console.error("Download error:", err);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setImageUrl("");
  };

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
    <div className="reviews-container">
      <h2>All Bookings</h2>

      <div className="filter-container">
        <input
          type="text"
          placeholder="Search by hoarding type"
          value={searchQuery}
          onChange={handleSearch}
        />
        <select value={filterCity} onChange={handleFilterCity}>
          <option value="">Filter by city</option>
          {Array.from(new Set(bookingData.map((b) => b.hordingId.cityId))).map((city) => (
            <option key={city} value={city}>
              {cityNames[city] || city}
            </option>
          ))}
        </select>
        <select value={filterArea} onChange={handleFilterArea}>
          <option value="">Filter by area</option>
          {Array.from(new Set(bookingData.map((b) => b.hordingId.areaId))).map((area) => (
            <option key={area} value={area}>
              {areaNames[area] || area}
            </option>
          ))}
        </select>
        <select value={filterRating} onChange={handleFilterRating}>
          <option value="">Filter by rating</option>
          {[1, 2, 3, 4, 5].map((rating) => (
            <option key={rating} value={rating}>
              {rating} ★
            </option>
          ))}
        </select>
      </div>

      <div className="cards-grid">
        {filteredData.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          filteredData.map((booking) => (
            <motion.div
              className="booking-card"
              key={booking._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={booking.addBannerUrl}
                alt="Banner"
                className="card-banner"
                onClick={() => handleImageClick(booking.addBannerUrl)}
              />
              <div className="card-content">
                <h3>{booking.userId?.firstName || "Unknown"}</h3>
                {booking.hordingId ? (
                  <>
                    <p>Type: {booking.hordingId.hoardingType}</p>
                    <p>Hourly Rate: ₹{booking.hordingId.hourlyRate}</p>
                    <p>State: {stateNames[booking.hordingId.stateId]}</p>
                    <p>City: {cityNames[booking.hordingId.cityId]}</p>
                    <p>Area: {areaNames[booking.hordingId.areaId]}</p>
                  </>
                ) : (
                  <p>Loading hoarding details...</p>
                )}
                <p>Start: {new Date(booking.Start_Time).toLocaleString()}</p>
                <p>End: {new Date(booking.End_Time).toLocaleString()}</p>
                <p>Total Cost: ₹{booking.Total_Cost}</p>
                <p>Payment Status: {booking.Payment_Status}</p>
                {typeof booking.review?.rating === "number" && (
                  <div>{renderStars(booking.review.rating)}</div>
                )}
                {booking.review?.comment && (
                  <p>
                    <strong>Comment:</strong> {booking.review.comment}
                  </p>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {modalOpen && (
        <motion.div
          className="modal-overlay"
          onClick={handleModalClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <img src={imageUrl} alt="Zoom" />
            <button onClick={handleDownload}>Download</button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Reviews;
