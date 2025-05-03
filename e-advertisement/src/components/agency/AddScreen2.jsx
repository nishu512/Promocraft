import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./AddScreen.css";

const stepVariants = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  exit: { opacity: 0, y: -50, transition: { duration: 0.4 } }
};

const stepsList = ["Details", "Location"];

export const AddScreen2 = () => {
  const [step, setStep] = useState(1);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);

  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/state/getallstates").then((res) => setStates(res.data.data));
  }, []);

  const getCityByStateId = async (id) => {
    const res = await axios.get("/city/getcitybystate/" + id);
    setCities(res.data.data);
  };

  const getAreaByCityId = async (id) => {
    const res = await axios.get("/area/getareabycity/" + id);
    setAreas(res.data.data);
  };

  const submitHandler = async (data) => {
    data.userId = localStorage.getItem("id");

    try {
      await axios.post("/hording/add", data);
      toast.success("Screen added successfully!");
      setTimeout(() => navigate("/myscreens"), 2000);
    } catch (err) {
      toast.error("Failed to add screen. Try again.");
    }
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 2));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const progressPercent = ((step - 1) / (stepsList.length - 1)) * 100;

  return (
    <div className="form-wrapper">
      <div className="form-container">
        <h1 className="text-center mb-4">Add New Screen</h1>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" variants={stepVariants} initial="initial" animate="animate" exit="exit">
              <div className="step-title">
                <h3>Details</h3>
                <div className="progress mb-4" style={{ height: "10px" }}>
                  <div
                    className="progress-bar bg-primary"
                    role="progressbar"
                    style={{ width: `${progressPercent}%`, transition: "width 0.5s ease-in-out" }}
                    aria-valuenow={progressPercent}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
              </div>
              <div className="form-group">
                <label>Hoarding Dimension</label>
                <input type="text" {...register("hoardingDimension")} />
              </div>
              <div className="form-group">
                <label>Hoarding Type</label>
                <select {...register("hoardingType")}>
                  <option value="Unipole">Unipole</option>
                  <option value="Billboard">Billboard</option>
                  <option value="Gantry">Gantry</option>
                  <option value="Digital">Digital</option>
                </select>
              </div>
              <div className="form-group">
                <label>Hourly Rate</label>
                <input type="number" {...register("hourlyRate")} />
              </div>
              <div className="text-end">
                <button className="btn btn-primary" onClick={nextStep}>Next</button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" variants={stepVariants} initial="initial" animate="animate" exit="exit">
              <div className="step-title">
                <h3>Location</h3>
                <div className="progress mb-4" style={{ height: "10px" }}>
                  <div
                    className="progress-bar bg-primary"
                    role="progressbar"
                    style={{ width: `${progressPercent}%`, transition: "width 0.5s ease-in-out" }}
                    aria-valuenow={progressPercent}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
              </div>
              <div className="form-group">
                <label>Latitude</label>
                <input type="text" {...register("latitude")} />
              </div>
              <div className="form-group">
                <label>Longitude</label>
                <input type="text" {...register("longitude")} />
              </div>
              <div className="form-group">
                <label>Select State</label>
                <select {...register("stateId")} onChange={(e) => getCityByStateId(e.target.value)}>
                  <option>SELECT STATE</option>
                  {states.map((state) => (
                    <option key={state._id} value={state._id}>{state.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Select City</label>
                <select {...register("cityId")} onChange={(e) => getAreaByCityId(e.target.value)}>
                  <option>SELECT CITY</option>
                  {cities.map((city) => (
                    <option key={city._id} value={city._id}>{city.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Select Area</label>
                <select {...register("areaId")}>
                  <option>SELECT AREA</option>
                  {areas.map((area) => (
                    <option key={area._id} value={area._id}>{area.name}</option>
                  ))}
                </select>
              </div>
              <div className="d-flex justify-content-between">
                <button className="btn btn-secondary" onClick={prevStep}>Back</button>
                <button className="btn btn-success" onClick={handleSubmit(submitHandler)}>Submit</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover theme="colored" />
      </div>
    </div>
  );
};
