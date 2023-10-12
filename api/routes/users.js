const express = require("express");
const Router = express.Router();
const userController = require("../controllers/userController");
const passport = require("passport");
require('dotenv').config();


Router.post("/users", userController.register);

Router.post("/users/login", userController.login);

module.exports = Router;