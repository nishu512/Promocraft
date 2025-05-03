import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import loginBackground from '../../assets/images/loginBackground.jpg';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';

export const Login = () => {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const [forgotMsg, setForgotMsg] = useState('');
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  const submitHandler = async (data) => {
    try {
      const res = await axios.post("/user/login", data);
      if (res.status === 200) {
        alert("Login Successful");
        localStorage.setItem("id", res.data.data._id);
        localStorage.setItem("role", res.data.data.roleId.name);

        const role = res.data.data.roleId.name;
        if (role === "user") navigate("/userprofile");
        else if (role === "agency") navigate("/agencyprofile");
        else if (role === "admin") navigate("/adminprofile");
      } else {
        alert("Login Failed");
      }
    } catch (error) {
      alert("Login error");
    }
  };

  const forgotPasswordHandler = async () => {
    setForgotMsg('');
    if (!forgotEmail) {
      setForgotMsg("Please enter your email ❌");
      return;
    }
    try {
      const res = await axios.post("/user/forgotpassword", { email: forgotEmail });
      if (res.status === 200) {
        setForgotMsg("Reset password email sent ✅");
        setShowEmailModal(false);
        setForgotEmail('');
      } else {
        setForgotMsg("Failed to send email ❌");
      }
    } catch (error) {
      setForgotMsg("Error sending email ❌");
    }
  };

  // Field focus animation variant
  const fieldFocusVariant = {
    hover: { scale: 1.05, boxShadow: "0px 4px 8px rgba(0, 173, 181, 0.4)" },
    tap: { scale: 0.95 },
  };

  return (
    <>
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
        animation: "backgroundMove 30s linear infinite", // 🎉 added animation
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 0,
      }}>
        {/* Home Button */}
        <Link to="/" style={{
          position: "fixed",
          top: "20px",
          left: "20px",
          zIndex: 10,
          textDecoration: "none"
        }}>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: "#00adb5",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px"
            }}
          >
            Home
          </motion.button>
        </Link>

        {/* Forgot Password Modal */}
        {showEmailModal && (
          <div style={{
            position: "fixed",
            top: 0, left: 0,
            width: "100vw", height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex", justifyContent: "center", alignItems: "center",
            zIndex: 20
          }}>
            <div style={{
              background: "white",
              padding: "20px",
              borderRadius: "10px",
              width: "300px",
              textAlign: "center"
            }}>
              <h3 style={{ marginBottom: "10px" }}>Enter your email</h3>
              <input
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="Email"
                style={{
                  width: "100%", padding: "10px",
                  marginBottom: "15px", borderRadius: "5px", border: "1px solid #ccc"
                }}
              />
              <div>
                <button
                  onClick={forgotPasswordHandler}
                  style={{
                    background: "#00adb5", color: "white",
                    padding: "10px 20px", border: "none", borderRadius: "5px",
                    cursor: "pointer", marginRight: "10px"
                  }}
                >
                  Submit
                </button>
                <button
                  onClick={() => setShowEmailModal(false)}
                  style={{
                    background: "#ccc", color: "black",
                    padding: "10px 20px", border: "none", borderRadius: "5px",
                    cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            background: "rgba(0, 173, 181, 0.85)",
            padding: "30px",
            borderRadius: "10px",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.3)",
            width: "350px",
            maxWidth: "90%",
            zIndex: 5,
            textAlign: "center"
          }}
        >
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{ marginBottom: "20px", color: "#EAEAEA" }}
          >
            Login
          </motion.h1>

          <form onSubmit={handleSubmit(submitHandler)}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              style={{ marginBottom: "10px", textAlign: "left" }}
            >
              <label>Email</label>
              <motion.input
                type="email"
                {...register("email", { required: true })}
                placeholder="Enter email"
                style={{
                  width: "100%",
                  padding: "10px",
                  marginTop: "5px",
                  borderRadius: "5px",
                  border: "1px solid #ccc"
                }}
                variants={fieldFocusVariant}
                whileHover="hover"
                whileTap="tap"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              style={{ marginBottom: "10px", textAlign: "left" }}
            >
              <label>Password</label>
              <motion.input
                type="password"
                {...register("password", { required: true })}
                placeholder="Enter password"
                style={{
                  width: "100%",
                  padding: "10px",
                  marginTop: "5px",
                  borderRadius: "5px",
                  border: "1px solid #ccc"
                }}
                variants={fieldFocusVariant}
                whileHover="hover"
                whileTap="tap"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              style={{ marginBottom: "20px", textAlign: "right" }}
            >
              <motion.span
                onClick={() => setShowEmailModal(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  color: "#22177A",
                  textDecoration: "none",
                  fontSize: "16px",
                  cursor: "pointer",
                  display: "inline-block"
                }}
              >
                Forgot Password?
              </motion.span>

              {forgotMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    marginTop: "10px",
                    fontSize: "13px",
                    color: forgotMsg.includes("✅") ? "green" : "red",
                    textAlign: "right"
                  }}
                >
                  {forgotMsg}
                </motion.div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <motion.input
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                value="Login"
                style={{
                  background: "#024CAA",
                  color: "white",
                  padding: "12px",
                  border: "none",
                  cursor: "pointer",
                  width: "100%",
                  borderRadius: "5px",
                  fontSize: "16px"
                }}
              />
            </motion.div>
          </form>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            style={{ marginTop: "20px" }}
          >
            Don’t have an account?{" "}
            <Link to="/signup" style={{
              color: "#F3C623",
              fontWeight: "bold",
              textDecoration: "none"
            }}>
              Register
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </>
  );
};
