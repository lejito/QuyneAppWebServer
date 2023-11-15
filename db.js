"use strict";
const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize({
  host: process.env.DBHOST,
  port: process.env.DBPORT,
  username: process.env.DBUSER,
  password: process.env.DBPASSWORD,
  database: process.env.DBNAME,
  dialect: "postgres",
  logging: false,
  pool: {
    max: 10,
    min: 0,
    idle: 10000,
  },
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

module.exports = sequelize;
