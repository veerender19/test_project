const mongoose = require("mongoose");
require('dotenv').config();
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const server = process.env.DB_HOST;
const dbport = process.env.DB_PORT;
const database = process.env.DB_NAME;
class Database {
  constructor() {
    this._connect();
  }
  _connect() {
      mongoose
      .connect(`mongodb://${server}:${dbport}/${database}`, {
          useNewUrlParser: true,
          useUnifiedTopology:true,
        })
        .then(() => {
          console.log("Database connected successful");
        })
        .catch(err => {
          console.error("Database connection error::" + err);
        });
  }
}

module.exports = new Database();