require('dotenv').config();
const sequelize = require("../../db");
const utils = require("./utils");

class MovimientosController {
  /**
  *
  * @param {import('express').Request} req
  * @param {import('express').Response} res
  */
  async consultarUltimos(req, res) {
    try {
      const token = req.headers.authorization;

      if (token) {
        const { idCuenta } = req.body;

        const consultarUltimosMovimientos = await sequelize.query(
          "SELECT * FROM consultar_ultimos_movimientos(:idCuenta::INT, :numeroMovimientos::INT);",
          {
            replacements: { idCuenta, numeroMovimientos: 50 }
          }
        );

        if (consultarUltimosMovimientos[0].length > 0) {

          res.status(200).json(utils.successResponse(
            "Movimientos recuperados correctamente.",
            { movimientos: utils.convertSnakeToCamel(consultarUltimosMovimientos[0]) }
          ));
        } else {
          res.status(200).json(utils.warningResponse(
            "No se encontró ningún movimiento.",
            { movimientos: [] }
          ));
        }
      } else {
        res.status(401).json(utils.errorResponse(
          'No se puede recuperar los movimientos. Autenticación no proporcionada.',
          null
        ));
      }

    } catch (error) {
      console.log(error);
      res.status(500).json(utils.errorResponse(
        "Ha ocurrido un error en el servidor.",
        null
      ));
    }
  }
}

module.exports = MovimientosController;