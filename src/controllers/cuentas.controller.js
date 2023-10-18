require('dotenv').config();
const jwt = require('jsonwebtoken');
const sequelize = require("../../db");
const utils = require("./utils");

const PARAM_ID_CUENTA = utils.createParam('idCuenta', 'number', false);
const PARAM_NUMERO_TELEFONO = utils.createParam('numeroTelefono', 'string', false);
const PARAM_MONTO = utils.createParam('monto', 'number', false);

class CuentasController {
  async consultarIdCuentaIdUsuarioAUX(idUsuario) {
    try {
      const consultarCodigoCuenta = await sequelize.query(
        "SELECT consultar_codigo_cuenta_id_usuario(:idUsuario::INT);",
        {
          replacements: { idUsuario }
        }
      );
  
      const idCuenta = consultarCodigoCuenta[0][0].consultar_codigo_cuenta_id_usuario;
  
      return idCuenta;
    } catch (error) {
      return -1;
    }
  }
  
  async consultarIdCuentaNumeroTelefonoAUX(numeroTelefono) {
    try {
      const consultarCodigoCuentaNumeroTelefono = await sequelize.query(
        "SELECT consultar_codigo_cuenta_numero_telefono(:numeroTelefono::VARCHAR(10));",
        {
          replacements: { numeroTelefono }
        }
      );
  
      const idCuenta = consultarCodigoCuentaNumeroTelefono[0][0].consultar_codigo_cuenta_numero_telefono;
  
      return idCuenta;
    } catch (error) {
      console.log(error);
      return -1;
    }
  }

  /**
  *
  * @param {import('express').Request} req
  * @param {import('express').Response} res
  */
  async consultarIdCuentaIdUsuario(req, res) {
    try {
      const token = req.headers.authorization;
      const { idUsuario } = jwt.verify(token, process.env.SECRETJWT);

      const idCuenta = await CuentasController.prototype.consultarIdCuentaIdUsuarioAUX(idUsuario);

      if (idCuenta != -1) {
        res.status(200).json(utils.successResponse(
          "Id de cuenta recuperado correctamente.",
          { idCuenta }
        ));
      } else {
        res.status(200).json(utils.errorResponse(
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

        const consultarCuenta = await sequelize.query(
          "SELECT * FROM consultar_cuenta(:idCuenta::INT);",
          {
            replacements: { idCuenta }
          }
        );

        if (consultarCuenta[0].length > 0) {
          const id = consultarCuenta[0][0].id;
          const numeroTelefono = consultarCuenta[0][0].numero_telefono;
          const idUsuario = consultarCuenta[0][0].id_usuario;
          const habilitada = consultarCuenta[0][0].habilitada;
          const saldoOculto = consultarCuenta[0][0].saldo_oculto;

          res.status(200).json(utils.successResponse(
            "Datos de la cuenta recuperados correctamente.",
            { cuenta: { id, numeroTelefono, idUsuario, habilitada, saldoOculto } }
          ));
        } else {
          res.status(200).json(utils.errorResponse(
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
          res.status(200).json(utils.errorResponse(
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
          res.status(200).json(utils.errorResponse(
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
          res.status(200).json(utils.errorResponse(
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
  async verificarExistenciaNumeroTelefono(req, res) {
    try {
      const requiredParams = [PARAM_NUMERO_TELEFONO];

      if (utils.validateBody(req, res, requiredParams)) {
        const { numeroTelefono } = req.body;

        const verificarExistenciaCuentaNumeroTelefono = await sequelize.query(
          "SELECT verificar_existencia_cuenta_numero(:numeroTelefono::VARCHAR(10));",
          {
            replacements: { numeroTelefono }
          }
        );

        const cuentaExistente = verificarExistenciaCuentaNumeroTelefono[0][0].verificar_existencia_cuenta_numero;

        res.status(200).json(utils.successResponse(
          "Verificación de cuenta existente realizada correctamente.",
          { cuentaExistente }
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
  async verificarSaldoSuficiente(req, res) {
    try {
      const token = req.headers.authorization;

      if (token) {
        const { idUsuario } = jwt.verify(token, process.env.SECRETJWT);
        const idCuenta = await CuentasController.prototype.consultarIdCuentaIdUsuarioAUX(idUsuario);
        const requiredParams = [PARAM_MONTO];

        if (utils.validateBody(req, res, requiredParams)) {
          const { monto } = req.body;

          const verificarSaldoSuficiente = await sequelize.query(
            "SELECT verificar_saldo_suficiente(:idCuenta::INT, :monto::DECIMAL(16,2));",
            {
              replacements: { idCuenta, monto }
            }
          );

          const saldoSuficiente = verificarSaldoSuficiente[0][0].verificar_saldo_suficiente;

          if (saldoSuficiente != null) {
            res.status(200).json(utils.successResponse(
              "Verificación de saldo realizada correctamente.",
              { saldoSuficiente }
            ));
          } else {
            res.status(200).json(utils.warningResponse(
              "No se encontró ninguna cuenta.",
              null
            ));
          }
        }
      } else {
        res.status(200).json(utils.errorResponse(
          'No se puede verificar la suficiencia de saldo. Autenticación no proporcionada.',
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

module.exports = CuentasController;