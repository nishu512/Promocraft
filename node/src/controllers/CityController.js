//add city
//display city
const cityModel = require("../models/CityModel");

const addCity = async (req, res) => {
  try {
    const savedCity = await cityModel.create(req.body);
    res.status(201).json({
      message: "City added successfully",
      data: savedCity,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getCities = async (req, res) => {
  try {
    const cities = await cityModel.find().populate("stateId");
    res.status(200).json({
      message: "All cities",
      data: cities,
    });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

const getCityByStateId = async (req, res) => {
  try {
    const cities = await cityModel.find({ stateId: req.params.stateId });
    res.status(200).json({
      message: "city found",
      data: cities,
    });
  } catch (err) {
    res.status(500).json({
      message: "city  not found",
    });
  }
};

const getCityById = async (req, res) => {
  try {
    const city = await cityModel.findById(req.params.cityId).populate('stateId');
    if (!city) {
      return res.status(404).json({
        message: "City not found",
      });
    }
    res.status(200).json({
      message: "City found",
      data: city,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
    });
  }
};


module.exports = { addCity, getCities, getCityByStateId,getCityById};