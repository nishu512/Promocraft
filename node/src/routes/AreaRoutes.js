const routes = require('express').Router();
const areaController = require('../controllers/AreaController');

// Add a new area
routes.post('/add', areaController.addArea);

// Get all areas
routes.get('/', areaController.getAreas);

// Get areas by cityId
routes.get("/getareabycity/:cityId", areaController.getAreaBycityId);

// Get area by areaId
routes.get("/getareabyid/:areaId", areaController.getAreaById); // New route for fetching area by areaId

module.exports = routes;
