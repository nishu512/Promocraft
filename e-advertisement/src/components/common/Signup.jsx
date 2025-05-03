import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import loginBackground from '../../assets/images/loginBackground.jpg';

export const Signup = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  useEffect(() => {
    document.body.style.margin = 0;
    document.body.style.padding = 0;
    document.body.style.fontFamily = "Arial, sans-serif";
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style = {};
    };
  }, []);

  const submitHandler = async (data) => {
    data.roleId = data.role === "agency" ? "67be8e82d0d34f074e804d32" : "67be8d57d0d34f074e804d2f";
    try {
      const res = await axios.post("user", data);
      if (res.status === 201) {
        toast.success("User created successfully 🎉");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        toast.error("User not created");
      }
    } catch (error) {
      toast.error("Error signing up. Please try again.");
    }
  };

  const stepVariant = {
    hidden: { opacity: 0, x: -20 },
    visible: i => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.1, duration: 0.4, ease: "easeOut" }
    })
  };

  const fieldFocusVariant = {
    hover: { scale: 1.05, boxShadow: "0px 4px 8px rgba(0, 173, 181, 0.4)" },
    tap: { scale: 0.95 },
  };

  return (
    <>
      <ToastContainer position="top-right" />
      <style>{`
        @keyframes backgroundMove {
          0% { background-position: center; }
          50% { background-position: center 20px; }
          100% { background-position: center; }
        }
      `}</style>
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        width: "100vw",
        backgroundImage: `url(${loginBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        animation: "backgroundMove 30s linear infinite",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 0,
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -30 }}
          animate={{
            opacity: 1,
            scale: [1, 1.02, 1],
            y: [0, -10, 0],
            boxShadow: [
              "0px 0px 10px rgba(0, 173, 181, 0.4)",
              "0px 0px 20px rgba(0, 173, 181, 0.6)",
              "0px 0px 10px rgba(0, 173, 181, 0.4)"
            ]
          }}
          transition={{ duration: 3, ease: "easeInOut" }}
          style={{
            background: "rgba(0, 173, 181, 0.85)",
            padding: "30px",
            borderRadius: "15px",
            textAlign: "center",
            maxWidth: "500px",
            width: "100%",
            overflowY: "auto",
            maxHeight: "95vh",
            backdropFilter: "blur(10px)",
            border: "2px solid #00adb5",
            zIndex: 1,
          }}
        >
          <h1 style={{ marginBottom: "20px", color: "#ffffff", fontSize: "2rem", textTransform: "uppercase" }}>User Signup</h1>

          <motion.form onSubmit={handleSubmit(submitHandler)}>
            {step === 1 && (
              <>
                {[
                  { label: "First Name", name: "firstName", type: "text", rules: { required: "First name is required" } },
                  { label: "Last Name", name: "lastName", type: "text", rules: { required: "Last name is required" } },
                  { label: "Email", name: "email", type: "email", rules: { required: "Email is required", pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, message: "Enter a valid email" } } },
                  { label: "Password", name: "password", type: "password", rules: { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters long" } } },
                  { label: "Confirm Password", name: "confirmPassword", type: "password", rules: { validate: value => value === watch("password") || "Passwords do not match" } },
                ].map((field, index) => (
                  <motion.div
                    key={index}
                    custom={index}
                    variants={stepVariant}
                    initial="hidden"
                    animate="visible"
                    style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "10px", marginBottom: "10px" }}
                  >
                    <label style={{ alignSelf: "center", color: "#ffffff", fontWeight: "bold" }}>{field.label}</label>
                    <div>
                      <motion.input
                        type={field.type}
                        {...register(field.name, field.rules)}
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: "5px",
                          border: "1px solid #ccc",
                          marginBottom: "5px",
                          backgroundColor: "#f0f0f0"
                        }}
                        variants={fieldFocusVariant}
                        whileHover="hover"
                        whileTap="tap"
                      />
                      {errors[field.name] && <p style={{ color: "red", fontSize: "12px" }}>{errors[field.name].message}</p>}
                    </div>
                  </motion.div>
                ))}
              </>
            )}

            {step === 2 && (
              <>
                {[
                  { label: "Age", name: "age", type: "number", rules: { required: "Age is required", min: { value: 18, message: "You must be at least 18 years old" } } },
                  { label: "Contact Number", name: "contactNo", type: "text", rules: { required: "Contact number is required", pattern: { value: /^[0-9]{10}$/, message: "Enter a valid 10-digit contact number" } } },
                ].map((field, index) => (
                  <motion.div
                    key={index}
                    custom={index}
                    variants={stepVariant}
                    initial="hidden"
                    animate="visible"
                    style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "10px", marginBottom: "10px" }}
                  >
                    <label style={{ alignSelf: "center", color: "#ffffff", fontWeight: "bold" }}>{field.label}</label>
                    <div>
                      <motion.input
                        type={field.type}
                        {...register(field.name, field.rules)}
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: "5px",
                          border: "1px solid #ccc",
                          marginBottom: "5px",
                          backgroundColor: "#f0f0f0"
                        }}
                        variants={fieldFocusVariant}
                        whileHover="hover"
                        whileTap="tap"
                      />
                      {errors[field.name] && <p style={{ color: "red", fontSize: "12px" }}>{errors[field.name].message}</p>}
                    </div>
                  </motion.div>
                ))}

                {/* Gender */}
                <motion.div
                  custom={3}
                  variants={stepVariant}
                  initial="hidden"
                  animate="visible"
                  style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "10px", marginBottom: "10px" }}
                >
                  <label style={{ alignSelf: "center", color: "#ffffff", fontWeight: "bold" }}>Gender</label>
                  <div>
                    <motion.select
                      {...register("gender", { required: "Gender is required" })}
                      style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc", backgroundColor: "#f0f0f0" }}
                      variants={fieldFocusVariant}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </motion.select>
                    {errors.gender && <p style={{ color: "red", fontSize: "12px" }}>{errors.gender.message}</p>}
                  </div>
                </motion.div>

                {/* Role */}
                <motion.div
                  custom={2}
                  variants={stepVariant}
                  initial="hidden"
                  animate="visible"
                  style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "10px", marginBottom: "10px" }}
                >
                  <label style={{ alignSelf: "center", color: "#ffffff", fontWeight: "bold" }}>Role</label>
                  <div>
                    <motion.select
                      {...register("role", { required: "Role is required" })}
                      style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc", backgroundColor: "#f0f0f0" }}
                      variants={fieldFocusVariant}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <option value="">Select role</option>
                      <option value="user">User</option>
                      <option value="agency">Agency</option>
                    </motion.select>
                    {errors.role && <p style={{ color: "red", fontSize: "12px" }}>{errors.role.message}</p>}
                  </div>
                </motion.div>
              </>
            )}

            {/* Navigation Buttons */}
            {step === 1 ? (
              <motion.button
                type="button"
                onClick={() => setStep(2)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: "#00adb5",
                  color: "white",
                  padding: "12px",
                  border: "none",
                  cursor: "pointer",
                  width: "100%",
                  borderRadius: "5px",
                  fontSize: "16px",
                  marginTop: "10px",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                }}
              >
                Next
              </motion.button>
            ) : (
              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <motion.button
                  type="button"
                  onClick={() => setStep(1)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    background: "#555",
                    color: "white",
                    padding: "12px",
                    border: "none",
                    cursor: "pointer",
                    flex: 1,
                    borderRadius: "5px",
                    fontSize: "16px",
                  }}
                >
                  Back
                </motion.button>
                <motion.input
                  type="submit"
                  value="Signup"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    background: "#169976",
                    color: "white",
                    padding: "12px",
                    border: "none",
                    cursor: "pointer",
                    flex: 1,
                    borderRadius: "5px",
                    fontSize: "16px",
                  }}
                />
              </div>
            )}
          </motion.form>

          <motion.div
            custom={10}
            variants={stepVariant}
            initial="hidden"
            animate="visible"
            style={{ marginTop: "15px" }}
          >
            <p style={{ color: "#ffffff" }}>
              Already have an account?{" "}
              <Link to="/login" style={{ color: "#00ffcc", textDecoration: "none", fontWeight: "bold" }}>
                Login
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};
  