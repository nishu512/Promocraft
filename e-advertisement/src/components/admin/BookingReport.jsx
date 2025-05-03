import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import { BarChart } from "@mui/x-charts/BarChart";
import { LineChart } from "@mui/x-charts/LineChart";
import "./BookingReport.css"; // Import updated CSS

const BookingReport = () => {
  const [bookingData, setBookingData] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch("http://localhost:3000/bookings/");
      const result = await response.json();
      if (result.data) {
        setBookingData(result.data);
      } else {
        console.error("Error fetching bookings:", result.message);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const totalBookings = bookingData.length;
  const pendingCount = bookingData.filter((b) => b.Status === "pending").length;
  const approvedCount = bookingData.filter((b) => b.Status === "approved").length;
  const rejectedCount = bookingData.filter((b) => b.Status === "rejected").length;
  const totalCostPaid = bookingData.reduce((sum, b) => sum + (b.Payment_Status === "paid" ? b.Total_Cost : 0), 0);
  const totalPendingPayment = bookingData.reduce((sum, b) => sum + (b.Payment_Status === "pending" ? b.Total_Cost : 0), 0);

  return (
    <Box className="report-container">
      <Typography variant="h4" className="report-title">
        Booking Report
      </Typography>

      {/* Info Cards */}
      <Grid container spacing={3} justifyContent="center">
        {[
          { label: "Total Bookings", value: totalBookings },
          { label: "Pending", value: pendingCount },
          { label: "Approved", value: approvedCount },
          { label: "Rejected", value: rejectedCount },
          { label: "Total Cost Paid", value: `₹${totalCostPaid}` },
          { label: "Pending Payment", value: `₹${totalPendingPayment}` },
        ].map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card className="report-card">
              <CardContent>
                <Typography variant="h6" color="textSecondary">
                  {item.label}
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {item.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts Section */}
      <div className="chart-section">
        {/* Row 1 - Two Pie Charts */}
       

        <div className="chart-box">
          <PieChart
            series={[
              {
                data: [
                  { id: 0, value: totalCostPaid, label: "Paid" },
                  { id: 1, value: totalPendingPayment, label: "Unpaid" },
                ],
                innerRadius: 60,
                outerRadius: 120,
                paddingAngle: 2,
                arcLabel: (item) => `${item.label} (${item.value})`,
                arcLabelRadius: 140, // Moves labels slightly outside
              },
            ]}
            width={350}
            height={350}
          />
        </div>

        {/* Row 2 - Bar and Line Charts */}
        <div className="chart-box">
          <BarChart
            series={[
              { data: [pendingCount, approvedCount, rejectedCount], label: "Bookings", type: "bar" },
            ]}
            xAxis={[{ data: ["Pending", "Approved", "Rejected"], scaleType: "band" }]}
            width={400}
            height={300}
          />
        </div>

       
      </div>

      {/* Table */}
      <TableContainer component={Paper} className="booking-table">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Hoarding Type</TableCell>
              <TableCell>Hoarding Dimension</TableCell>
              <TableCell>Total Cost </TableCell>
              <TableCell>Payment Status</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
  {bookingData.map((booking) => (
    <TableRow key={booking._id}>
      <TableCell>
        {booking.userId?.firstName ?? "N/A"} {booking.userId?.lastName ?? ""}
      </TableCell>
      <TableCell>{booking.hordingId?.hoardingType ?? "N/A"}</TableCell>
      <TableCell>{booking.hordingId?.hoardingDimension ?? "N/A"}</TableCell>
      <TableCell>₹{booking.Total_Cost ?? 0}</TableCell>
      <TableCell>{booking.Payment_Status ?? "N/A"}</TableCell>
      <TableCell>{booking.Status ?? "N/A"}</TableCell>
    </TableRow>
  ))}
</TableBody>

        </Table>
      </TableContainer>
    </Box>
  );
};

export default BookingReport;
