require('dotenv').config();
const jwt = require('jsonwebtoken');
const sequelize = require("../../db");
const utils = require("./utils");

const PARAM_ID_CUENTA = utils.createParam('idCuenta', 'number', false);

class CuentasController {
  /**
  *
  * @param {import('express').Request} req
  * @param {import('express').Response} res
  */
  async consultarIdCuentaIdUsuario(req, res) {
    try {
      const token = req.headers.authorization;
      const { idUsuario } = jwt.verify(token, process.env.SECRETJWT);

      const consultarCodigoCuenta = await sequelize.query(
        "SELECT consultar_codigo_cuenta_id_usuario(:idUsuario::INT);",
        {
          replacements: { idUsuario }
        }
      );

      const idCuenta = consultarCodigoCuenta[0][0].consultar_codigo_cuenta_id_usuario;

      if (idCuenta != -1) {
        res.status(200).json(utils.successResponse(
          "Id de cuenta recuperado correctamente.",
          { idCuenta }
        ));
      } else {
        res.status(404).json(utils.errorResponse(
          "No se encontró ninguna cuenta con el usuario especificado.",
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

  /**
  *
  * @param {import('express').Request} req
  * @param {import('express').Response} res
  */
  async consultarDatos(req, res) {
    try {
      const requiredParams = [PARAM_ID_CUENTA];

      if (utils.validateBody(req, res, requiredParams)) {
        const { idCuenta } = req.body;

        const consultarCodigoCuenta = await sequelize.query(
          "SELECT * FROM consultar_cuenta(:idCuenta::INT);",
          {
            replacements: { idCuenta }
          }
        );

        if (consultarCodigoCuenta[0].length > 0) {
          const id = consultarCodigoCuenta[0][0].id;
          const numeroTelefono = consultarCodigoCuenta[0][0].numero_telefono;
          const idUsuario = consultarCodigoCuenta[0][0].id_usuario;
          const habilitada = consultarCodigoCuenta[0][0].habilitada;
          const saldoOculto = consultarCodigoCuenta[0][0].saldo_oculto;

          res.status(200).json(utils.successResponse(
            "Datos de la cuenta recuperados correctamente.",
            { cuenta: { id, numeroTelefono, idUsuario, habilitada, saldoOculto } }
          ));
        } else {
          res.status(404).json(utils.errorResponse(
            "No se encontró ninguna cuenta con el id especificado.",
            null
          ));
        }
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
  async consultarSaldo(req, res) {
    try {
      const requiredParams = [PARAM_ID_CUENTA];

      if (utils.validateBody(req, res, requiredParams)) {
        const { idCuenta } = req.body;

        const consultarSaldo = await sequelize.query(
          "SELECT * FROM consultar_saldo(:idCuenta::INT);",
          {
            replacements: { idCuenta }
          }
        );

        if (consultarSaldo[0].length > 0) {
          const saldo = parseFloat(consultarSaldo[0][0].saldo);
          const saldoBolsillos = parseFloat(consultarSaldo[0][0].saldo_bolsillos);

          res.status(200).json(utils.successResponse(
            "Saldo de la cuenta recuperados correctamente.",
            { cuenta: { saldo, saldoBolsillos } }
          ));
        } else {
          res.status(404).json(utils.errorResponse(
            "No se encontró ninguna cuenta con el id especificado.",
            null
          ));
        }
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
  async activarSaldoOculto(req, res) {
    try {
      const requiredParams = [PARAM_ID_CUENTA];

      if (utils.validateBody(req, res, requiredParams)) {
        const token = req.headers.authorization;
        const { idUsuario } = jwt.verify(token, process.env.SECRETJWT);
        const { idCuenta } = req.body;

        const activarSaldoOculto = await sequelize.query(
          "SELECT activar_saldo_oculto(:idUsuario::INT, :idCuenta::INT);",
          {
            replacements: { idUsuario, idCuenta }
          }
        );

        if (activarSaldoOculto[0][0].activar_saldo_oculto) {
          res.status(200).json(utils.successResponse(
            "Saldo oculto activado correctamente.",
            {}
          ));
        } else {
          res.status(404).json(utils.errorResponse(
            "No se encontró ninguna cuenta con el id especificado.",
            null
          ));
        }
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
  async desactivarSaldoOculto(req, res) {
    try {
      const requiredParams = [PARAM_ID_CUENTA];

      if (utils.validateBody(req, res, requiredParams)) {
        const token = req.headers.authorization;
        const { idUsuario } = jwt.verify(token, process.env.SECRETJWT);
        const { idCuenta } = req.body;

        const desactivarSaldoOculto = await sequelize.query(
          "SELECT desactivar_saldo_oculto(:idUsuario::INT, :idCuenta::INT);",
          {
            replacements: { idUsuario, idCuenta }
          }
        );

        if (desactivarSaldoOculto[0][0].desactivar_saldo_oculto) {
          res.status(200).json(utils.successResponse(
            "Saldo oculto desactivado correctamente.",
            {}
          ));
        } else {
          res.status(404).json(utils.errorResponse(
            "No se encontró ninguna cuenta con el id especificado.",
            null
          ));
        }
      }
    } catch (error) {
      res.status(500).json(utils.errorResponse(
        "Ha ocurrido un error en el servidor.",
        null
      ));
    }
  }
}

module.exports = CuentasController;