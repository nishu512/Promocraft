import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Grid, Box } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import { BarChart } from "@mui/x-charts/BarChart";

const AgencyReport = () => {
  const [bookingData, setBookingData] = useState([]);
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
      } else {
        console.error("Error fetching bookings:", result.message);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const totalBookings = bookingData.length;
  const pendingCount = bookingData.filter(b => b.Status === "pending").length;
  const approvedCount = bookingData.filter(b => b.Status === "approved").length;
  const rejectedCount = bookingData.filter(b => b.Status === "rejected").length;

  const totalCostPaid = bookingData.reduce((sum, b) => sum + (b.Payment_Status === "paid" ? b.Total_Cost : 0), 0);
  const totalPendingPayment = bookingData.reduce((sum, b) => sum + (b.Payment_Status === "pending" ? b.Total_Cost : 0), 0);

  const paymentChartData = [
    { id: 0, value: Math.round(totalCostPaid), label: "Paid" },
    { id: 1, value: Math.round(totalPendingPayment), label: "Unpaid" },
  ];

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom textAlign="center" fontWeight="bold">
        Agency Report
      </Typography>
      
      <Grid container spacing={3} justifyContent="center">
        {[{ label: "Total Bookings", value: totalBookings },
          { label: "Pending", value: pendingCount },
          { label: "Approved", value: approvedCount },
          { label: "Rejected", value: rejectedCount },
          { label: "Total Cost Paid", value: `₹${totalCostPaid}` },
          { label: "Pending Payment", value: `₹${totalPendingPayment}` }].map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ boxShadow: 3, borderRadius: 2, textAlign: "center", padding: 2 }}>
              <CardContent>
                <Typography variant="h6" color="textSecondary">{item.label}</Typography>
                <Typography variant="h4" fontWeight="bold">{item.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box display="flex" flexDirection="column" alignItems="center" gap={5} mt={4}>
        <PieChart
          series={[{
            data: paymentChartData,
            innerRadius: 50,
            outerRadius: 100,
          }]}
          width={300}
          height={300}
          sx={{ "& .MuiChartsLegend-root": { marginTop: 10, marginLeft: 120 } }}
        />
        
        <BarChart
          series={[{
            data: [Math.round(pendingCount), Math.round(approvedCount), Math.round(rejectedCount)],
            label: "Bookings",
            type: "bar",
          }]}
          xAxis={[{ data: ["Pending", "Approved", "Rejected"], scaleType: "band" }]}
          width={400}
          height={300}
        />
      </Box>
    </Box>
  );
};

export default AgencyReport;
