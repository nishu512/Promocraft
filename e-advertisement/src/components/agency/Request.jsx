import React, { useEffect, useState } from "react";
import { motion } from "framer-motion"; // Import framer-motion
import "./Request.css";

const Request = () => {
  const [bookingData, setBookingData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [cityNames, setCityNames] = useState({});
  const [stateNames, setStateNames] = useState({});
  const [areaNames, setAreaNames] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [filterArea, setFilterArea] = useState("");
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
      } else {
        console.error("Error fetching bookings:", result.message);
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
    filterBookings(value, filterCity, filterArea);
  };

  const handleFilterCity = (e) => {
    const value = e.target.value;
    setFilterCity(value);
    filterBookings(searchQuery, value, filterArea);
  };

  const handleFilterArea = (e) => {
    const value = e.target.value;
    setFilterArea(value);
    filterBookings(searchQuery, filterCity, value);
  };

  const filterBookings = (query, city, area) => {
    const filtered = bookingData.filter((booking) => {
      const type = booking.hordingId?.hoardingType?.toLowerCase() || "";
      const matchesSearch = type.includes(query.toLowerCase());
      const matchesCity = !city || booking.hordingId.cityId === city;
      const matchesArea = !area || booking.hordingId.areaId === area;
      return matchesSearch && matchesCity && matchesArea;
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

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:3000/booking/${bookingId}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (response.ok) {
        fetchBookings(); // Refresh
      } else {
        console.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const getStatusStyle = (status) => {
    const colors = {
      pending: "#2196F3",
      approved: "#4CAF50",
      rejected: "#f44336",
    };
    return {
      backgroundColor: colors[status] || "#999",
      color: "#fff",
      padding: "6px 10px",
      borderRadius: "5px",
      border: "none",
      cursor: "pointer",
      boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
    };
  };

  return (
    <div className="my-booking-container">
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
          {Array.from(
            new Set(bookingData.map((b) => b.hordingId.cityId))
          ).map((city) => (
            <option key={city} value={city}>
              {cityNames[city] || city}
            </option>
          ))}
        </select>
        <select value={filterArea} onChange={handleFilterArea}>
          <option value="">Filter by area</option>
          {Array.from(
            new Set(bookingData.map((b) => b.hordingId.areaId))
          ).map((area) => (
            <option key={area} value={area}>
              {areaNames[area] || area}
            </option>
          ))}
        </select>
      </div>

      <motion.table
        className="booking-table"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <thead>
          <tr>
            <th>First Name</th>
            <th>Banner</th>
            <th>State</th>
            <th>City</th>
            <th>Area</th>
            <th>Hoarding Type</th>
            <th>Hourly Rate</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Total Cost</th>
            <th>Payment Status</th>
            <th>Booking Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length === 0 ? (
            <tr>
              <td colSpan="12">No bookings found.</td>
            </tr>
          ) : (
            filteredData.map((booking) => (
              <motion.tr
                key={booking._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <td>{booking.userId?.firstName || "Unknown"}</td>
                <td>
                  <img
                    src={booking.addBannerUrl}
                    alt="Banner"
                    onClick={() => handleImageClick(booking.addBannerUrl)}
                    style={{ width: "80px", cursor: "pointer" }}
                  />
                </td>
                {booking.hordingId ? (
                  <>
                    <td>
                      {stateNames[booking.hordingId.stateId] || "Loading..."}
                    </td>
                    <td>
                      {cityNames[booking.hordingId.cityId] || "Loading..."}
                    </td>
                    <td>
                      {areaNames[booking.hordingId.areaId] || "Loading..."}
                    </td>
                    <td>{booking.hordingId.hoardingType}</td>
                    <td>{booking.hordingId.hourlyRate}</td>
                  </>
                ) : (
                  <td colSpan="5">Loading hoarding details...</td>
                )}
                <td>{new Date(booking.Start_Time).toLocaleString()}</td>
                <td>{new Date(booking.End_Time).toLocaleString()}</td>
                <td>{booking.Total_Cost}</td>
                <td>{booking.Payment_Status}</td>
                <td>
                  <select
                    value={booking.Status}
                    onChange={(e) =>
                      handleStatusChange(booking._id, e.target.value)
                    }
                    style={getStatusStyle(booking.Status)}
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </td>
              </motion.tr>
            ))
          )}
        </tbody>
      </motion.table>

      {/* Image Modal with animation */}
      {modalOpen && (
        <motion.div
          className="modal-overlay"
          onClick={handleModalClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src={imageUrl}
              alt="Preview"
              style={{ maxWidth: "100%", maxHeight: "80vh" }}
            />
            <div style={{ marginTop: "10px", textAlign: "center" }}>
              <button onClick={handleDownload} style={{ marginRight: "10px" }}>
                Download
              </button>
              <button onClick={handleModalClose}>Close</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Request;
