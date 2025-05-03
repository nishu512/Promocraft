import axios from 'axios';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';

const ResetPassword = () => {
    const { token } = useParams();
    const { register, handleSubmit, formState: { errors } } = useForm();

    const submitHandler = async (data) => {
        try {
            const obj = {
                token: token,
                password: data.password,
            };

            const res = await axios.post("/user/resetpassword", obj, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (res.status === 200) {
                alert("Password reset successfully!");
            } else {
                alert("Failed to reset password. Please try again.");
            }

        } catch (error) {
            alert("There was an error resetting your password. Please try again.");
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: '#f5f5f5',
            fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
        }}>
            <div style={{
                background: '#fff',
                padding: '40px',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                width: '400px',
                textAlign: 'center'
            }}>
                <h1 style={{
                    fontSize: '24px',
                    marginBottom: '10px',
                    color: '#333'
                }}>Reset Your Password</h1>
                <p style={{
                    fontSize: '14px',
                    color: '#777',
                    marginBottom: '20px'
                }}>Enter a new password for your account</p>
                <form onSubmit={handleSubmit(submitHandler)} style={{ width: '100%' }}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: '500',
                            marginBottom: '6px',
                            color: '#333'
                        }}>New Password</label>
                        <input
                            type="password"
                            placeholder="Enter new password"
                            {...register("password", {
                                required: "Password is required",
                                minLength: { value: 6, message: "Password must be at least 6 characters long" }
                            })}
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #ddd',
                                borderRadius: '5px',
                                fontSize: '16px',
                                color: '#333',
                                outline: 'none',
                                transition: 'border-color 0.3s ease'
                            }}
                        />
                        {errors.password && <p style={{
                            color: '#f44336',
                            fontSize: '12px',
                            marginTop: '6px'
                        }}>{errors.password.message}</p>}
                    </div>

                    <div>
                        <input
                            type="submit"
                            value="Reset Password"
                            style={{
                                width: '100%',
                                padding: '12px',
                                backgroundColor: '#4CAF50',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '5px',
                                fontSize: '16px',
                                cursor: 'pointer',
                                transition: 'background-color 0.3s ease'
                            }}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
