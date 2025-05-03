const routes = require("express").Router();
const stateController = require("../controllers/StateController");

// Add a new state
routes.post("/addstate", stateController.addState);

// Get all states
routes.get("/getallstates", stateController.getAllStates);

// Get state by ID
routes.get("/state/:id", stateController.getStateById); // New route for fetching state by ID

module.exports = routes;
