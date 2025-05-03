import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Table, Button, Modal, Input, Select, notification } from "antd";
import { motion } from "framer-motion";
import "./Dashboard.css";

const { Option } = Select;

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({ type: "", state: "", city: "", area: "", pincode: "" });
  const [cities, setCities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statesRes, citiesRes, areasRes] = await Promise.all([
        axios.get("http://localhost:3000/state/getallstates"),
        axios.get("http://localhost:3000/city/getallcities"),
        axios.get("http://localhost:3000/area/"),
      ]);

      const states = statesRes.data.data;
      const cities = citiesRes.data.data;
      const areas = areasRes.data.data;

      const stateCityMap = states.map((state) => ({
        ...state,
        cities: cities
          .filter((city) => city.stateId?._id === state._id)
          .map((city) => ({
            ...city,
            areas: areas.filter((area) => area.cityId?._id === city._id),
          })),
      }));

      setData(stateCityMap);
      setCities(cities);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSave = async () => {
    try {
      let payload = {};
      let url = "";

      if (form.type === "State") {
        url = "http://localhost:3000/state/addstate";
        payload = { name: form.state };
      } else if (form.type === "City") {
        if (!form.state) return console.error("State is required for adding a city.");
        url = "http://localhost:3000/city/addcity";
        payload = { name: form.city, stateId: form.state };
      } else if (form.type === "Area") {
        if (!form.city || !form.pincode) return console.error("City and Pincode are required for adding an area.");
        url = "http://localhost:3000/area/add";
        payload = { name: form.area, cityId: form.city, pincode: form.pincode };
      }

      await axios.post(url, payload);
      setModalVisible(false);
      setForm({ type: "", state: "", city: "", area: "", pincode: "" });
      fetchData();

      notification.success({
        message: "Data Saved Successfully",
        description: `The ${form.type} has been added.`,
      });
    } catch (error) {
      console.error("Error saving data:", error);
      notification.error({
        message: "Error Saving Data",
        description: "There was an issue saving the data. Please try again.",
      });
    }
  };

  const columns = [
    {
      title: "State",
      dataIndex: "name",
      key: "state",
    },
    {
      title: "Cities",
      key: "cities",
      render: (state) =>
        state.cities.length ? (
          <ul className="nested-list">
            {state.cities.map((city) => (
              <li key={city._id}>{city.name}</li>
            ))}
          </ul>
        ) : (
          "No cities"
        ),
    },
    {
      title: "Areas",
      key: "areas",
      render: (state) =>
        state.cities.length ? (
          <ul className="nested-list">
            {state.cities.map((city) => (
              <li key={city._id}>
                {city.name}
                <ul>
                  {city.areas.map((area) => (
                    <li key={area._id}>
                      {area.name} (Pincode: {area.pincode})
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        ) : (
          "No areas"
        ),
    },
  ];

  return (
    <motion.div
      className="dashboard-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated Background */}
      <motion.div
        className="animated-background"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          className="blob pink"
          animate={{ x: [0, 100, 0], y: [0, -100, 0] }}
          transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
        />
        <motion.div
          className="blob blue"
          animate={{ x: [0, -100, 0], y: [0, 100, 0] }}
          transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Heading */}
      <motion.h2
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="dashboard-heading"
      >
        Location Details
      </motion.h2>

      {/* Add Data Button */}
      <div className="header">
        <Button className="add-data-button" type="primary" onClick={() => setModalVisible(true)}>
          Add New Data
        </Button>
      </div>

      {/* Table */}
      <motion.div
        className="table-section"
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Table dataSource={data} rowKey="_id" columns={columns} className="data-table" />
      </motion.div>

      {/* Modal for Adding Data */}
      <Modal
        title="Add New Entry"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSave}
        className="custom-modal"
      >
        <Select
          placeholder="Select Type"
          value={form.type}
          onChange={(value) => setForm({ ...form, type: value })}
          style={{ width: "100%", marginBottom: 12 }}
        >
          <Option value="State">State</Option>
          <Option value="City">City</Option>
          <Option value="Area">Area</Option>
        </Select>

        {form.type === "State" && (
          <Input
            placeholder="State Name"
            value={form.state}
            onChange={(e) => setForm({ ...form, state: e.target.value })}
          />
        )}

        {form.type === "City" && (
          <>
            <Select
              placeholder="Select State"
              value={form.state}
              onChange={(value) => setForm({ ...form, state: value })}
              style={{ width: "100%", marginBottom: 10 }}
            >
              {data.map((state) => (
                <Option key={state._id} value={state._id}>
                  {state.name}
                </Option>
              ))}
            </Select>
            <Input
              placeholder="City Name"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />
          </>
        )}

        {form.type === "Area" && (
          <>
            <Select
              placeholder="Select City"
              value={form.city}
              onChange={(value) => setForm({ ...form, city: value })}
              style={{ width: "100%", marginBottom: 10 }}
            >
              {cities.map((city) => (
                <Option key={city._id} value={city._id}>
                  {city.name}
                </Option>
              ))}
            </Select>
            <Input
              placeholder="Area Name"
              value={form.area}
              onChange={(e) => setForm({ ...form, area: e.target.value })}
            />
            <Input
              placeholder="Pincode"
              type="number"
              value={form.pincode}
              onChange={(e) => setForm({ ...form, pincode: e.target.value })}
              style={{ marginTop: 10 }}
            />
          </>
        )}
      </Modal>
    </motion.div>
  );
};

export default Dashboard;
