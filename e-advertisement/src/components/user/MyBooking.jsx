import React, { useEffect, useState } from "react";
import "./MyBooking.css";
import html2pdf from "html2pdf.js";
import logo from "./logo.jpg";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MyBooking = () => {
  const [bookingData, setBookingData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [filterArea, setFilterArea] = useState("");
  const [mapCoords, setMapCoords] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const userId = localStorage.getItem("id");

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBKhGnGwljJ5LpOrAvbv1zTLSns2VaCnag`;
    script.async = true;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
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

  const handlePayment = async (booking) => {
    const options = {
      key: "rzp_test_bko0Tgqc4fdLII",
      amount: booking.Total_Cost * 100,
      currency: "INR",
      name: "Hoarding Booking",
      description: "Pay for hoarding booking",
      handler: async function (response) {
        await updatePaymentStatus(booking._id, "Paid");
        fetchBookings();
        toast.success("Payment Successful!");
      },
      prefill: {
        name: "",
        email: "",
        contact: "",
      },
      theme: { color: "#F37254" },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const updatePaymentStatus = async (bookingId, status) => {
    try {
      const response = await fetch(
        `http://localhost:3000/bookings/updatePaymentStatus/${bookingId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ Payment_Status: status }),
        }
      );
      const result = await response.json();
      if (result.success) {
        fetchBookings();
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
    }
  };

  const handleInvoice = (booking) => {
    const element = document.createElement("div");
    const user = booking.userId || {};
    const hording = booking.hordingDetails || {};

    const htmlContent = `
      <h1>Invoice</h1>
      <p><strong>First Name:</strong> ${user.firstName || ''}</p>
      <p><strong>Last Name:</strong> ${user.lastName || ''}</p>
      <p><strong>Email:</strong> ${user.email || ''}</p>
      <p><strong>Booking ID:</strong> ${booking._id}</p>
      <table style="width:100%; border-collapse:collapse;">
        <tr><th>Start</th><td>${new Date(booking.Start_Time).toLocaleString()}</td></tr>
        <tr><th>End</th><td>${new Date(booking.End_Time).toLocaleString()}</td></tr>
        <tr><th>Total Cost</th><td>₹${booking.Total_Cost}</td></tr>
        <tr><th>Payment</th><td>${booking.Payment_Status}</td></tr>
        <tr><th>Status</th><td>${booking.Status}</td></tr>
      </table>
    `;

    element.innerHTML = htmlContent;

    html2pdf()
      .set({
        margin: 10,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(element)
      .outputPdf("blob")
      .then((pdfBlob) => {
        const downloadLink = document.createElement("a");
        downloadLink.href = URL.createObjectURL(pdfBlob);
        downloadLink.download = `invoice_${booking._id}.pdf`;
        downloadLink.click();

        const formData = new FormData();
        formData.append("invoice", pdfBlob, `invoice_${booking._id}.pdf`);
        formData.append("bookingId", booking._id);
        formData.append("userEmail", user.email);

        fetch("http://localhost:3000/sendInvoice/sendInvoice", {
          method: "POST",
          body: formData,
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              toast.success("Invoice sent to your email!");
            } else {
              toast.error("Failed to send invoice.");
            }
          })
          .catch((err) => {
            console.error("Error:", err);
            toast.error("Error sending invoice.");
          });
      });
  };

  const openMap = (lat, lng) => {
    setMapCoords({ lat, lng });
    setShowMap(true);
  };

  const closeMap = () => {
    setShowMap(false);
    setMapCoords(null);
  };

  return (
    <motion.div className="my-booking-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="booking-card-grid">
        {filteredData.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          filteredData.map((booking) => (
            <motion.div className="booking-card" key={booking._id}>
              <img src={booking.addBannerUrl} alt="Banner" className="booking-banner" />
              <p><strong>Hoarding Type:</strong> {booking.hordingDetails?.hoardingType}</p>
              <p><strong>City:</strong> {booking.hordingDetails?.cityId?.name}</p>
              <p><strong>Area:</strong> {booking.hordingDetails?.areaId?.name}</p>
              <p><strong>Start:</strong> {new Date(booking.Start_Time).toLocaleString()}</p>
              <p><strong>End:</strong> {new Date(booking.End_Time).toLocaleString()}</p>
              <p><strong>Total cost:</strong> ₹{booking.Total_Cost.toLocaleString()}</p>
              <p><strong>Status:</strong> {booking.Status}</p>
              <p><strong>Payment:</strong> {booking.Payment_Status}</p>
              <p><strong>Latitude:</strong> {booking.hordingDetails?.latitude}</p>
              <p><strong>Longitude:</strong> {booking.hordingDetails?.longitude}</p>
              <div className="booking-actions">
  {booking.Payment_Status !== "paid" && booking.Status === "approved" && (
    <button onClick={() => handlePayment(booking)}>Pay Now</button>
  )}
  <button onClick={() => handleInvoice(booking)}>Generate Invoice</button>
  <button onClick={() => openMap(booking.hordingDetails?.latitude, booking.hordingDetails?.longitude)}>View on Map</button>
</div>

            </motion.div>
          ))
        )}
      </div>

      {showMap && mapCoords && (
        <div className="map-modal">
          <div className="map-container">
            <button onClick={closeMap}>Close</button>
            <iframe
              width="100%"
              height="400"
              loading="lazy"
              allowFullScreen
              src={`https://www.google.com/maps?q=${mapCoords.lat},${mapCoords.lng}&z=15&output=embed`}
            ></iframe>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default MyBooking;
