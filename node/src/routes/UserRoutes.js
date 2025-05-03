const routes = require("express").Router();
const userController = require("../controllers/UserController");

routes.post("/user", userController.signup);
routes.get("/users", userController.getAllUsers);
routes.get("/user/:id", userController.getUserById);
routes.delete("/user/:id", userController.deleteUserById);
routes.post("/user/login", userController.loginUser);
routes.put("/user/:id", userController.updateUserById); // New update route
routes.post("/user/forgotpassword",userController.forgotPassword)
routes.post("/user/resetpassword",userController.resetpassword)

module.exports = routes;
