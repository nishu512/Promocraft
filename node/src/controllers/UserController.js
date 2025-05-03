

const userModel = require("../models/UserModel");
const bcrypt = require("bcrypt");
const mailUtil = require("../utils/MailUtil");
const jwt = require("jsonwebtoken");
const secret = "secret";

// Login User
const loginUser = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const foundUserFromEmail = await userModel.findOne({ email: email }).populate("roleId");

    if (foundUserFromEmail != null) {
      const isMatch = bcrypt.compareSync(password, foundUserFromEmail.password);
      if (isMatch == true) {
        res.status(200).json({
          message: "Login success",
          data: foundUserFromEmail,
        });
      } else {
        res.status(404).json({
          message: "Invalid credentials",
        });
      }
    } else {
      res.status(404).json({
        message: "Email not found",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error while logging in",
      error: err,
    });
  }
};

// Signup User
const signup = async (req, res) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);
    req.body.password = hashedPassword;

    const createdUser = await userModel.create(req.body);

    await mailUtil.sendingMail(createdUser.email, "Welcome to eadvertisement", "This is a welcome mail");

    res.status(201).json({
      message: "User created successfully",
      data: createdUser,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Error during signup",
      data: err,
    });
  }
};

// Add User
const addUser = async (req, res) => {
  try {
    const savedUser = await userModel.create(req.body);
    res.json({
      message: "User saved successfully",
      data: savedUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error saving user",
      data: err,
    });
  }
};

// Get All Users
const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find().populate("roleId");
    res.json({
      message: "Users fetched successfully",
      data: users,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error fetching users",
      data: err,
    });
  }
};

// Get User By ID
const getUserById = async (req, res) => {
  try {
    const foundUser = await userModel.findById(req.params.id);
    if (!foundUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    res.json({
      message: "User fetched successfully",
      data: foundUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error fetching user",
      data: err,
    });
  }
};

// Delete User By ID
const deleteUserById = async (req, res) => {
  try {
    const deletedUser = await userModel.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    res.json({
      message: "User deleted successfully",
      data: deletedUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error deleting user",
      data: err,
    });
  }
};

// Update User By ID (newly added function)
const updateUserById = async (req, res) => {
  try {
    const updatedUser = await userModel.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error updating user",
      data: err,
    });
  }
};

const forgotPassword = async (req, res) => {
  const email = req.body.email;
  const foundUser = await userModel.findOne({ email: email });

  if (foundUser) {
    const token = jwt.sign(foundUser.toObject(), secret);
    console.log(token);
    const url = `http://localhost:5173/resetpassword/${token}`;
    const mailContent = `<html>
                          <a href ="${url}">rest password</a>
                          </html>`;
    //email...
    await mailUtil.sendingMail(foundUser.email, "reset password", mailContent);
    res.json({
      message: "reset password link sent to mail.",
    });
  } else {
    res.json({
      message: "user not found register first..",
    });
  }
};

const resetpassword = async (req, res) => {
  const token = req.body.token; //decode --> email | id
  const newPassword = req.body.password;

  const userFromToken = jwt.verify(token, secret);
  //object -->email,id..
  //password encrypt...
  const salt = bcrypt.genSaltSync(10);
  const hashedPasseord = bcrypt.hashSync(newPassword,salt);

  const updatedUser = await userModel.findByIdAndUpdate(userFromToken._id, {
    password: hashedPasseord,
  });
  res.json({
    message: "password updated successfully..",
  });
};

module.exports = {
  addUser,
  getAllUsers,
  getUserById,
  deleteUserById,
  signup,
  loginUser,
  forgotPassword,
  updateUserById,
  resetpassword
};




