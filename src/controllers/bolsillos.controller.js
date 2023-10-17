require('dotenv').config();
const jwt = require('jsonwebtoken');
const sequelize = require("../../db");
const utils = require("./utils");

class BolsillosController {
  /**
  *
  * @param {import('express').Request} req
  * @param {import('express').Response} res
  */
  async consultar(req, res) {
    try {
      const token = req.headers.authorization;

      if (token) {
        const { idCuenta } = req.body;

        const consultarBolsillos = await sequelize.query(
          "SELECT * FROM consultar_bolsillos(:idCuenta::INT);",
          {
            replacements: { idCuenta }
          }
        );

        if (consultarBolsillos[0].length > 0) {

          res.status(200).json(utils.successResponse(
            "Bolsillos recuperados correctamente.",
            { bolsillos: utils.convertSnakeToCamel(consultarBolsillos[0]) }
          ));
        } else {
          res.status(200).json(utils.warningResponse(
            "No se encontró ningún bolsillo.",
            { bolsillos: [] }
          ));
        }
      } else {
        res.status(401).json(utils.errorResponse(
          'No se puede recuperar los bolsillos. Autenticación no proporcionada.',
          null
        ));
      }

    } catch (error) {
      res.status(500).json(utils.errorResponse(
        "Ha ocurrido un error en el servidor.",
        null
      ));
    }
  }

  /**
  *
  * @param {import('express').Request} req
  * @param {import('express').Response} res
  */
  async crear(req, res) {
    try {
      const token = req.headers.authorization;

      if (token) {
        const { idUsuario } = jwt.verify(token, process.env.SECRETJWT);
        const { idCuenta, nombre, saldoObjetivo } = req.body;

        const crearBolsillo = await sequelize.query(
          "SELECT * FROM crear_bolsillo(:idUsuario::INT, :idCuenta::INT, :nombre::VARCHAR(20), :saldoObjetivo::DECIMAL(16,2));",
          {
            replacements: { idUsuario, idCuenta, nombre, saldoObjetivo }
          }
        );

        if (crearBolsillo[0].length > 0) {

          res.status(200).json(utils.successResponse(
            "Bolsillo creado correctamente.",
            { bolsillo: utils.convertSnakeToCamel(crearBolsillo[0][0]) }
          ));
        } else {
          res.status(200).json(utils.warningResponse(
            "No se creó el bolsillo.",
            { bolsillo: [] }
          ));
        }
      } else {
        res.status(401).json(utils.errorResponse(
          'No se puede crear el bolsillo. Autenticación no proporcionada.',
          null
        ));
      }

    } catch (error) {
      res.status(500).json(utils.errorResponse(
        "Ha ocurrido un error en el servidor.",
        null
      ));
    }
  }
}

module.exports = BolsillosController;