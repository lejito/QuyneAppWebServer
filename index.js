"use strict";
const dotenv = require('dotenv');
dotenv.config();
//cargar el modulo con la configuración de la api
const app = require("./app");
//realizar la conexión con la base de datos postgresql
const { sequelize } = require('./config/db');
const runServer = async () => {
  try {
    await sequelize.authenticate();
    app.listen(parseInt(process.env.PORT), () => {
      console.log(
        `Servidor corriendo correctamente en la url: localhost:${process.env.PORT}`
      );
    })
  } catch (error) {
    console.log("Ha ocurrido un error");
    console.log(error);
  }
}

runServer()