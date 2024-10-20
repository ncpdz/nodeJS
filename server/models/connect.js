const mysql = require("mysql2");

function connectDB() {
  const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "phi171102",
    database: "ecma",
  });
  return connection;
}

module.exports = connectDB;