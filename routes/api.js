const express = require("express");
const Router = express.Router();
    
const userRoutes = require("../api/routes/users")
const bookRoutes = require("../api/routes/books")
Router.use("/api", userRoutes);
Router.use("/api", bookRoutes);
module.exports = Router;