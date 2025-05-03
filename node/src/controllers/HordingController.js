const hordingModel = require("../models/HordingModel");
const multer = require("multer");
const path = require("path");
const cloudinaryUtil = require("../utils/CloudanryUtil");
//storage engine

const storage = multer.diskStorage({
  destination: "./uploads",
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

//multer object....

const upload = multer({
  storage: storage,
  //fileFilter:
}).single("image");

const addHording = async (req, res) => {
  try {
    const savedHording = await hordingModel.create(req.body);
    res.status(201).json({
      message: "Hording added successfully",
      data: savedHording,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const getAllHordings = async (req, res) => {
  try {
    const hordings = await hordingModel
      .find()
      .populate("cityId", "name") // Populates the cityId with the city name
      .populate("stateId", "name") // Populates state name as well
      .populate("areaId", "name") // Populates area name
      .populate("userId", "username");

    if (hordings.length === 0) {
      res.status(404).json({ message: "No hoardings found" });
    } else {
      res.status(200).json({
        message: "Hoardings found successfully",
        data: hordings,
      });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllHordingsByUserId = async (req, res) => {
  try {
    const hordings = await hordingModel
      .find({ userId: req.params.userId })
      .populate("stateId cityId areaId userId");
    if (hordings.length === 0) {
      res.status(404).json({ message: "No hordings found" });
    } else {
      res.status(200).json({
        message: "Hording found successfully",
        data: hordings,
      });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const addHordingWithFile = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.log(err);
      res.status(500).json({
        message: err.message,
      });
    } else {
      // database data store
      //cloundinary

      const cloundinaryResponse = await cloudinaryUtil.uploadFileToCloudinary(
        req.file
      );
      console.log(cloundinaryResponse);
      console.log(req.body);

      //store data in database
      req.body.hordingURL = cloundinaryResponse.secure_url;
      const savedHording = await hordingModel.create(req.body);

      res.status(200).json({
        message: "hording saved successfully",
        data: savedHording,
      });
    }
  });
};
const updateHording = async (req, res) => {
  //update tablename set  ? where id = ?
  //update new data -->req.body
  //id -->req.params.id

  try {
    const updatedHording = await hordingModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json({
      message: "Hording updated successfully",
      data: updatedHording,
    });
  } catch (err) {
    res.status(500).json({
      message: "error while update hording",
      err: err,
    });
  }
};
const getHordingById = async (req, res) => {
  try {
    const hording = await hordingModel
      .findById(req.params.id)
      .populate("cityId", "name")  // Populates the cityId with the city name
      .populate("stateId", "name") // Populates the stateId with the state name
      .populate("areaId", "name")  // Populates the areaId with the area name
      .populate("userId", "username"); // Populates the userId with the username

    if (!hording) {
      res.status(404).json({ message: "No hording found" });
    } else {
      res.status(200).json({
        message: "Hording found successfully",
        data: hording,
      });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteHording = async (req, res) => {
  try {
    const deletedHording = await hordingModel.findByIdAndDelete(req.params.hordingId);
    
    if (!deletedHording) {
      return res.status(404).json({ message: "Hording not found" });
    }

    res.status(200).json({
      message: "Hording deleted successfully",
      data: deletedHording,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const updateAvailabilityStatus = async (req, res) => {
  try {
    const { availabilityStatus } = req.body; // Get the status from the request body
    const updatedHording = await hordingModel.findByIdAndUpdate(
      req.params.id,
      { Availablity_Status: availabilityStatus }, // Update the availability status
      { new: true } // Return the updated hording
    );

    if (!updatedHording) {
      return res.status(404).json({ message: "Hording not found" });
    }

    res.status(200).json({
      message: "Hording availability status updated successfully",
      data: updatedHording,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error while updating hording availability status",
      err: err,
    });
  }
};



module.exports = {
  addHording,
  getAllHordings,
  addHordingWithFile,
  getAllHordingsByUserId,
  updateHording,
  getHordingById,
  deleteHording,
  updateAvailabilityStatus
};