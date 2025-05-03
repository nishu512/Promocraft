const stateModel = require("../models/StateModel");

// Add State
const addState = async (req, res) => {
  try {
    const savedState = await stateModel.create(req.body);
    res.status(201).json({
      message: "State added successfully",
      data: savedState,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Get All States
const getAllStates = async (req, res) => {
  try {
    const states = await stateModel.find();
    res.status(200).json({
      message: "All states fetched successfully",
      data: states,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Get State by ID
const getStateById = async (req, res) => {
  const { id } = req.params;

  try {
    const state = await stateModel.findById(id);

    if (!state) {
      return res.status(404).json({
        message: "State not found",
      });
    }

    res.status(200).json({
      message: "State fetched successfully",
      data: state,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {
  addState,
  getAllStates,
  getStateById, // Add this method to the exports
};
