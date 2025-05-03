import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CustLoder } from '../common/CustLoader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';
import './ViewMyScreens.css';

export const ViewMyScreens = () => {
    const [screens, setscreens] = useState([]);
    const [isLoading, setisLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const getAllMyScreens = async () => {
        setisLoading(true);
        try {
            const res = await axios.get("/hording/getHordingsbyuserid/" + localStorage.getItem("id"));
            setscreens(res.data.data);
        } catch (error) {
            console.error("Error fetching hording details:", error);
        } finally {
            setisLoading(false);
        }
    };

    useEffect(() => {
        getAllMyScreens();
    }, []);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this hoarding?");
        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:3000/hording/deleteHording/${id}`);
                getAllMyScreens();
                toast.success('Hoarding deleted successfully');
            } catch (error) {
                toast.error('Error deleting hoarding');
            }
        }
    };

    const handleAvailabilityStatusChange = async (id, currentStatus) => {
        const updatedStatus = !currentStatus;
        try {
            await axios.put(`/hording/updateAvailabilityStatus/${id}`, {
                availabilityStatus: updatedStatus
            });
            getAllMyScreens();
            toast.success(updatedStatus ? 'Hoarding is now Available' : 'Hoarding is now Unavailable');
        } catch (error) {
            toast.error('Error updating availability status');
        }
    };

    const closeModal = () => {
        setSelectedImage(null);
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                when: "beforeChildren",
                staggerChildren: 0.1
            }
        }
    };

    const rowVariants = {
        hidden: { opacity: 0, x: -30 },
        visible: { opacity: 1, x: 0 }
    };

    // Pagination logic
    const totalPages = Math.ceil(screens.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = screens.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const renderPageNumbers = () => {
        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`pagination-button ${currentPage === i ? 'active' : ''}`}
                >
                    {i}
                </button>
            );
        }
        return pageNumbers;
    };

    return (
        <motion.div
            className="screens-container"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {isLoading && <CustLoder />}

            <motion.table className="custom-table">
                <thead>
                    <tr>
                        <th>Hoarding Dimension</th>
                        <th>Hoarding Type</th>
                        <th>Hourly Rate</th>
                        <th>State</th>
                        <th>City</th>
                        <th>Area</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems?.map((sc) => (
                        <motion.tr
                            key={sc._id}
                            variants={rowVariants}
                            whileHover={{ scale: 1.02, backgroundColor: "#444" }}
                        >
                            <td>{sc.hoardingDimension}</td>
                            <td>{sc.hoardingType}</td>
                            <td>{sc.hourlyRate}</td>
                            <td>{sc.stateId?.name}</td>
                            <td>{sc.cityId?.name}</td>
                            <td>{sc.areaId?.name}</td>
                            <td>
                                <button
                                    className="btn-status"
                                    style={{
                                        backgroundColor: sc.Availablity_Status ? '#4CAF50' : '#ff9800'
                                    }}
                                    onClick={() => handleAvailabilityStatusChange(sc._id, sc.Availablity_Status)}
                                >
                                    {sc.Availablity_Status ? 'Available' : 'Unavailable'}
                                </button>
                            </td>
                            <td>
                                <Link to={`/updateScreen/${sc._id}`} className="btn btn-info">UPDATE</Link>
                                <button
                                    className="btn-delete"
                                    onClick={() => handleDelete(sc._id)}
                                >
                                    DELETE
                                </button>
                            </td>
                        </motion.tr>
                    ))}
                </tbody>
            </motion.table>

            <div className="pagination-container">
                {renderPageNumbers()}
            </div>

            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                style={{ marginTop: '55px' }}
            />
        </motion.div>
    );
};
