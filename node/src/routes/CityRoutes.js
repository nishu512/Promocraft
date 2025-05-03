const routes = require('express').Router();
const cityController = require('../controllers/CityController');

routes.post("/addcity", cityController.addCity);
routes.get("/getallcities", cityController.getCities);
routes.get("/getcitybystate/:stateId", cityController.getCityByStateId);
routes.get("/getcitybyid/:cityId", cityController.getCityById); // New route for fetching city by cityId

module.exports = routes;
