import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './BookingForm.css';

export const BookingForm = () => {
  const [formData, setFormData] = useState({
    Start_Time: '',
    End_Time: '',
    AddContent: '',
    addBannerUrl: null,
    Total_Cost: 0,
    Payment_Status: 'pending',
    Status: 'pending',
    userId: '',
    hordingId: ''
  });
  const [hourlyRate, setHourlyRate] = useState(0);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();


  useEffect(() => {
    const fetchHordingDetails = async () => {
      const hordingId = localStorage.getItem('selectedHordingId');
      if (hordingId) {
        try {
          const response = await fetch(`http://localhost:3000/hording/getHordingById/${hordingId}`);
          const data = await response.json();
          if (data.data?.hourlyRate) setHourlyRate(data.data.hourlyRate);
          setFormData(prev => ({ ...prev, hordingId }));
        } catch (error) {
          console.error('Error fetching hording details:', error);
        }
      }
    };

    fetchHordingDetails();
    const userId = localStorage.getItem('id');
    if (userId) setFormData(prev => ({ ...prev, userId }));
  }, []);

  const handleTimeChange = (e) => {
    const { name, value } = e.target;
    const date = new Date(value);
    date.setMinutes(0);
    const adjustedDate = date.toISOString().slice(0, 16);
    setFormData({ ...formData, [name]: adjustedDate });
  };

  useEffect(() => {
    const validateBookingTimes = async () => {
      if (formData.Start_Time && formData.End_Time && hourlyRate > 0) {
        const startTime = new Date(formData.Start_Time).getTime();
        const endTime = new Date(formData.End_Time).getTime();

        if (endTime <= startTime) {
          setMessage("End time must be after the start time.");
          return;
        }

        const diffInHours = Math.abs((endTime - startTime) / (1000 * 60 * 60));
        if (diffInHours < 10) {
          setMessage("There must be at least 10 hours between bookings.");
          return;
        }

        setMessage("");
        const totalCost = diffInHours * hourlyRate;
        setFormData(prev => ({ ...prev, Total_Cost: totalCost.toFixed(2) }));
      }
    };
    validateBookingTimes();
  }, [formData.Start_Time, formData.End_Time, hourlyRate]);

  const handleFileChange = (e) => {
    setFormData({ ...formData, addBannerUrl: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    Object.keys(formData).forEach(key => form.append(key, formData[key]));
    setTimeout(() => navigate("/MyBooking"), 2500);


    try {
      const response = await fetch('http://localhost:3000/bookingWithFile', {
        method: 'POST',
        body: form,
      });

      if (response.ok) {
        toast.success('Booking added successfully!');
        setMessage('');
      } else {
        toast.error('Error while submitting the booking.');
      }
    } catch (error) {
      toast.error('Server error during submission.');
      console.error('Error:', error);
    }
  };

  return (
    <div className="booking-bg">
      <motion.div
        className="booking-form-container"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2>Book Your Ad Campaign</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Start Time:</label>
            <input type="datetime-local" name="Start_Time" value={formData.Start_Time} onChange={handleTimeChange} required />
          </div>

          <div className="form-group">
            <label>End Time:</label>
            <input type="datetime-local" name="End_Time" value={formData.End_Time} onChange={handleTimeChange} required />
          </div>

          <div className="form-group">
            <label>Content:</label>
            <textarea name="AddContent" value={formData.AddContent} onChange={(e) => setFormData({ ...formData, AddContent: e.target.value })} required />
          </div>

          <div className="form-group">
            <label>Upload Banner:</label>
            <input type="file" name="addBannerUrl" onChange={handleFileChange} required />
          </div>

          <div className="form-group">
            <label>Total Cost: ₹ {formData.Total_Cost}</label>
          </div>

          <div className="button-container">
            <button type="submit">Submit Booking</button>
          </div>
        </form>

        {message && <p className="message">{message}</p>}
        <ToastContainer position="top-right" autoClose={3000} />
      </motion.div>
    </div>
  );
};
