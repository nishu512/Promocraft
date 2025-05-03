import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export const UpdateMyScreen = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [areas, setAreas] = useState([]);
    const [toast, setToast] = useState({ message: '', show: false });

    useEffect(() => {
        getAllStates();
    }, []);

    const getAllStates = async () => {
        try {
            const res = await axios.get("/state/getallstates");
            setStates(res.data.data);
        } catch (error) {
            console.error("Error fetching states:", error);
        }
    };

    const getCityByStateId = async (stateId) => {
        try {
            const res = await axios.get(`/city/getcitybystate/${stateId}`);
            setCities(res.data.data);
        } catch (error) {
            console.error("Error fetching cities:", error);
        }
    };

    const getAreaByCityId = async (cityId) => {
        try {
            const res = await axios.get(`/area/getareabycity/${cityId}`);
            setAreas(res.data.data);
        } catch (error) {
            console.error("Error fetching areas:", error);
        }
    };

    const { register, handleSubmit } = useForm({
        defaultValues: async () => {
            try {
                const res = await axios.get(`/hording/getHordingById/${id}`);
                return res.data.data;
            } catch (error) {
                console.error("Error fetching hoarding details:", error);
                return {};
            }
        }
    });

    const submitHandler = async (data) => {
        try {
            data.userId = localStorage.getItem("id");
            delete data._id;

            const res = await axios.put(`/hording/updatehording/${id}`, data);
            if (res.status === 200) {
                // Set toast visibility and message
                setToast({ message: 'Hoarding updated successfully!', show: true });

                // Log to debug
                console.log('Toast should show:', toast);

                // Hide toast after 3 seconds
                setTimeout(() => {
                    setToast({ message: '', show: false });
                }, 3000);

                navigate("/myscreens");
            }
        } catch (error) {
            console.error("Error updating hoarding:", error);
        }
    };

    return (
        <>
            {toast.show && (
                <motion.div
                    className="toast-notification"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{
                        position: 'fixed',
                        top: '20px',
                        right: '20px',
                        background: 'rgba(0, 255, 0, 0.9)',
                        color: 'white',
                        padding: '10px 20px',
                        borderRadius: '5px',
                        boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
                    }}
                >
                    {toast.message}
                </motion.div>
            )}

            <motion.div
                className="d-flex justify-content-center align-items-center min-vh-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                style={{
                    background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
                    overflow: 'hidden',
                }}
            >
                <motion.div
                    className="card p-4"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.7 }}
                    style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '20px',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 0 30px rgba(0, 0, 0, 0.2)',
                        width: '100%',
                        maxWidth: '500px',
                        color: '#fff',
                        marginTop: '50px', // Added top margin
                    }}
                >
                    <h2 className="text-center mb-4 fw-bold" style={{ color: '#fff' }}>
                        Update Screen
                    </h2>
                    <form onSubmit={handleSubmit(submitHandler)}>
                        <div className="mb-3">
                            <label className="form-label text-white">Hoarding Dimension</label>
                            <input type="text" className="form-control" {...register("hoardingDimension")} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label text-white">Hoarding Type</label>
                            <select className="form-select" {...register("hoardingType")}>
                                <option value="Unipole">Unipole</option>
                                <option value="Billboard">Billboard</option>
                                <option value="Gantry">Gantry</option>
                                <option value="Digital">Digital</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label text-white">Hourly Rate</label>
                            <input type="number" className="form-control" {...register("hourlyRate")} />
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label text-white">Latitude</label>
                                <input type="text" className="form-control" {...register("latitude")} />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label text-white">Longitude</label>
                                <input type="text" className="form-control" {...register("longitude")} />
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label text-white">Select State</label>
                            <select
                                className="form-select"
                                {...register("stateId")}
                                onChange={(e) => getCityByStateId(e.target.value)}
                            >
                                <option>SELECT STATE</option>
                                {states.map((state) => (
                                    <option key={state._id} value={state._id}>{state.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label text-white">Select City</label>
                            <select
                                className="form-select"
                                {...register("cityId")}
                                onChange={(e) => getAreaByCityId(e.target.value)}
                            >
                                <option>SELECT CITY</option>
                                {cities.map((city) => (
                                    <option key={city._id} value={city._id}>{city.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="form-label text-white">Select Area</label>
                            <select className="form-select" {...register("areaId")}>
                                <option>SELECT AREA</option>
                                {areas.map((area) => (
                                    <option key={area._id} value={area._id}>{area.name}</option>
                                ))}
                            </select>
                        </div>

                        <motion.button
                            type="submit"
                            className="btn w-100 fw-bold"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                            style={{
                                background: 'linear-gradient(90deg, #00f0ff, #ff00f0)',
                                color: '#fff',
                                border: 'none',
                                padding: '12px',
                                borderRadius: '12px',
                                boxShadow: '0 0 15px rgba(0, 255, 255, 0.6)',
                                transition: '0.3s',
                            }}
                        >
                            Submit
                        </motion.button>
                    </form>
                </motion.div>
            </motion.div>
        </>
    );
};
