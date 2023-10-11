const Sequelize = require('sequelize');

const sequelize = new Sequelize(`postgres://${process.env.USER}:${process.env.PASSWORD}@${process.env.HOST}:${process.env.DBPORT}/${process.env.DATABASE}?sslmode=require`);

module.exports = { sequelize }
