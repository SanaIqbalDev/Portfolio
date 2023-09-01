const express = require("express");

const app = express();
app.use(express.json());
app.listen(4000, () => {
  console.log("The server is active on port 3000");
});

const mongoose = require("mongoose");

const server = '127.0.0.1:27017'; 
const database = 'MyDB'; 
class Database {
  constructor() {
    this._connect();
  }
  _connect() {
    mongoose
      .connect(`mongodb://${server}/${database}`)
      .then(() => {
        console.log('Database connection successful');
      })
      .catch((err) => {
        console.error('Database connection failed');
      });
  }
}

module.exports = new Database();