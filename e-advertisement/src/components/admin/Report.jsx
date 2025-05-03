import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Report = () => {
  const [hoardingData, setHoardingData] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // For search functionality
  const [availabilityFilter, setAvailabilityFilter] = useState(""); // For availability filter
  const [typeFilter, setTypeFilter] = useState(""); // For hoarding type filter

  // Fetch hoarding data from your API
  useEffect(() => {
    fetchHoardings();
  }, []);

  const fetchHoardings = async () => {
    try {
      const response = await fetch("http://localhost:3000/hording/all"); // Replace with your API
      const result = await response.json();
      if (result.data) {
        setHoardingData(result.data);
      } else {
        console.error("Error fetching hoardings:", result.message);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Function to handle search and filters
  const filterData = () => {
    return hoardingData.filter((data) => {
      // Apply search filter
      const matchesSearch =
        data.hoardingType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (data.cityId?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (data.stateId?.name || "").toLowerCase().includes(searchTerm.toLowerCase());

      // Apply availability filter
      const matchesAvailability =
        availabilityFilter === ""
          ? true
          : availabilityFilter === "Available"
          ? data.Availablity_Status
          : !data.Availablity_Status;

      // Apply type filter
      const matchesType =
        typeFilter === "" ? true : data.hoardingType === typeFilter;

      return matchesSearch && matchesAvailability && matchesType;
    });
  };

  return (
    <div>
      {/* Filters */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search by hoarding type, city, or state"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginRight: "10px", padding: "5px" }}
        />
        <select
          value={availabilityFilter}
          onChange={(e) => setAvailabilityFilter(e.target.value)}
          style={{ marginRight: "10px", padding: "5px" }}
        >
          <option value="">Filter by Availability</option>
          <option value="Available">Available</option>
          <option value="Not Available">Not Available</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          style={{ marginRight: "10px", padding: "5px" }}
        >
          <option value="">Filter by Type</option>
          <option value="Unipole">Unipole</option>
          <option value="Billboard">Billboard</option>
          <option value="Gantry">Gantry</option>
          <option value="Digital">Digital</option>
        </select>
      </div>

      {/* Table to show hoarding data */}
      <h2>Hoarding Data Table</h2>
      <table border="1" width="100%">
        <thead>
          <tr>
            <th>Dimension</th>
            <th>Type</th>
            <th>Availability</th>
            <th>Hourly Rate</th>
            <th>Latitude</th>
            <th>Longitude</th>
            <th>City</th>
            <th>State</th>
            <th>Area</th>
          </tr>
        </thead>
        <tbody>
          {filterData().map((data) => (
            <tr key={data._id}>
              <td>{data.hoardingDimension}</td>
              <td>{data.hoardingType}</td>
              <td>{data.Availablity_Status ? "Available" : "Not Available"}</td>
              <td>{data.hourlyRate}</td>
              <td>{data.latitude}</td>
              <td>{data.longitude}</td>
              <td>{data.cityId?.name || "N/A"}</td>
              <td>{data.stateId?.name || "N/A"}</td>
              <td>{data.areaId?.name || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Bar Chart to visualize hoarding data */}
      <h2>Hourly Rates by Hoarding Type</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={filterData()}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="hoardingType" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="hourlyRate" fill="#2193b0" /> {/* Change the color of the bars here */}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Report;
