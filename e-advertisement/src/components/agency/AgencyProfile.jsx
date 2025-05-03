import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import './AgencyProfile.css';

export const AgencyProfile = () => {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    contactNo: '',
    gender: '',
    age: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const userId = localStorage.getItem('id');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/user/${userId}`);
        const user = response.data.data;
        setUserData({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          contactNo: user.contactNo || '',
          gender: user.gender || '',
          age: user.age || '',
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (userId) fetchUserData();
  }, [userId]);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/user/${userId}`, userData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const fadeVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: (i = 1) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.6 },
    }),
  };

  const fieldFocusVariant = {
    hover: { scale: 1.05, boxShadow: "0 0 8px rgba(0, 173, 181, 0.4)" },
    tap: { scale: 0.97 }
  };

  return (
    <div className="profile-wrapper">
      <motion.div
        className="profile-card"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="profile-title">{isEditing ? 'Edit Your Profile' : 'My Profile'}</h2>

        <AnimatePresence mode="wait">
          {!isEditing ? (
            <motion.div
              key="view"
              className="profile-view"
              variants={fadeVariant}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {Object.entries(userData).map(([key, value], i) => (
                <motion.div className="profile-field" key={key} custom={i} variants={fadeVariant}>
                  <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                  <p>{value}</p>
                </motion.div>
              ))}
              <motion.button
                className="btn btn-primary"
                onClick={() => setIsEditing(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Edit Profile
              </motion.button>
            </motion.div>
          ) : (
            <motion.form
              key="edit"
              onSubmit={handleSubmit}
              className="profile-form"
              variants={fadeVariant}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <div className="form-grid">
                {Object.keys(userData).map((field, i) => (
                  <motion.div className="form-group" key={field} custom={i} variants={fadeVariant}>
                    <label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                    {field === 'gender' ? (
                      <motion.select
                        name="gender"
                        id="gender"
                        value={userData.gender}
                        onChange={handleChange}
                        className="form-input"
                        required
                        variants={fieldFocusVariant}
                        whileHover="hover"
                        whileTap="tap"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </motion.select>
                    ) : (
                      <motion.input
                        type={field === 'email' ? 'email' : field === 'age' ? 'number' : 'text'}
                        name={field}
                        id={field}
                        value={userData[field]}
                        onChange={handleChange}
                        className="form-input"
                        required
                        variants={fieldFocusVariant}
                        whileHover="hover"
                        whileTap="tap"
                      />
                    )}
                  </motion.div>
                ))}
              </div>
              <div className="form-actions">
                <motion.button type="submit" className="btn btn-primary" whileHover={{ scale: 1.05 }}>
                  Save
                </motion.button>
                <motion.button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsEditing(false)}
                  whileHover={{ scale: 1.05 }}
                >
                  Cancel
                </motion.button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
