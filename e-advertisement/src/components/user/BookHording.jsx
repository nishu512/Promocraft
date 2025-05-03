import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./BookHording.css";

const BookHording = () => {
  const [hoardingData, setHoardingData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchHoardings();
  }, []);

  const fetchHoardings = async () => {
    try {
      const response = await fetch("http://localhost:3000/hording/all");
      const result = await response.json();
      if (result.data) {
        setHoardingData(result.data);
      } else {
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const filterData = () => {
    return hoardingData.filter((data) => {
      const matchesSearch =
        data.hoardingType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (data.cityId?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (data.stateId?.name || "").toLowerCase().includes(searchTerm.toLowerCase());

      const matchesAvailability =
        availabilityFilter === ""
          ? true
          : availabilityFilter === "Available"
          ? data.Availablity_Status
          : !data.Availablity_Status;

      const matchesType = typeFilter === "" ? true : data.hoardingType === typeFilter;

      return matchesSearch && matchesAvailability && matchesType;
    });
  };

  const handleBook = (hordingId) => {
    localStorage.setItem("selectedHordingId", hordingId);
    toast.success("Redirecting to booking form...");
    setTimeout(() => navigate("/BookingForm"), 2500);
  };

  return (
    <div className="book-hoarding-container">
      <ToastContainer position="top-right" />
      
      <div className="filter-container">
        <input
          type="text"
          placeholder="Search by hoarding type, city, or state"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field"
        />
        <select
          value={availabilityFilter}
          onChange={(e) => setAvailabilityFilter(e.target.value)}
          className="input-field"
        >
          <option value="">Filter by Availability</option>
          <option value="Available">Available</option>
          <option value="Not Available">Not Available</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="input-field"
        >
          <option value="">Filter by Type</option>
          <option value="Unipole">Unipole</option>
          <option value="Billboard">Billboard</option>
          <option value="Gantry">Gantry</option>
          <option value="Digital">Digital</option>
        </select>
      </div>

      <div className="card-container">
        {filterData().map((data) => (
          <motion.div
            key={data._id}
            className="card"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h3>{data.hoardingType}</h3>
            <p><strong>Dimension:</strong> {data.hoardingDimension}</p>
            <p><strong>Availability:</strong> {data.Availablity_Status ? "Available" : "Not Available"}</p>
            <p><strong>Hourly Rate:</strong> ₹ {data.hourlyRate}</p>
            <p><strong>Location:</strong> {data.cityId?.name || "N/A"}, {data.stateId?.name || "N/A"}</p>
            <p><strong>Area:</strong> {data.areaId?.name || "N/A"}</p>
            <p><strong>Latitude:</strong> {data.latitude || "N/A"}</p>
            <p><strong>Longitude:</strong> {data.longitude || "N/A"}</p>
            <button onClick={() => handleBook(data._id)} className="book-btn">Book</button>
          </motion.div> 
        ))}
      </div>
    </div>
  );
};

export default BookHording;
