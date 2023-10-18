require('dotenv').config();
const jwt = require('jsonwebtoken');
const sequelize = require("../../db");
const utils = require("./utils");
const CuentasController = require('./cuentas.controller');

const PARAM_NUMERO_TELEFONO = utils.createParam('numeroTelefono', 'string', false);
const PARAM_ENTIDAD_DESTINO = utils.createParam('entidadDestino', 'string', false);
const PARAM_CUENTA_DESTINO = utils.createParam('cuentaDestino', 'string', false);
const PARAM_REFERENCIA = utils.createParam('referencia', 'string', false);
const PARAM_DESCRIPCION = utils.createParam('descripcion', 'string', false);
const PARAM_TIPO_DOCUMENTO = utils.createParam('tipoDocumento', 'string', false);
const PARAM_NUMERO_DOCUMENTO = utils.createParam('numeroDocumento', 'string', false);
const PARAM_OPERADOR = utils.createParam('operador', 'string', false);
const PARAM_NOMBRE_PAQUETE = utils.createParam('nombre', 'string', false);
const PARAM_MONTO = utils.createParam('monto', 'number', false);

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
        const { idUsuario } = jwt.verify(token, process.env.SECRETJWT);
        const idCuenta = await CuentasController.prototype.consultarIdCuentaIdUsuarioAUX(idUsuario);

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
        res.status(200).json(utils.errorResponse(
          'No se puede recuperar los movimientos. Autenticación no proporcionada.',
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
  async realizarTransferenciaInterna(req, res) {
    try {
      const token = req.headers.authorization;

      if (token) {
        const { idUsuario } = jwt.verify(token, process.env.SECRETJWT);
        const requiredParams = [PARAM_NUMERO_TELEFONO, PARAM_MONTO];

        if (utils.validateBody(req, res, requiredParams)) {
          const { numeroTelefono, monto } = req.body;

          const idCuentaOrigen = await CuentasController.prototype.consultarIdCuentaIdUsuarioAUX(idUsuario);
          const idCuentaDestino = await CuentasController.prototype.consultarIdCuentaNumeroTelefonoAUX(numeroTelefono);

          if (idCuentaOrigen != -1 && idCuentaDestino != -1) {
            const realizarTransferenciaInterna = await sequelize.query(
              "SELECT * FROM realizar_transferencia_interna(:idCuentaOrigen::INT, :idCuentaDestino::INT, :monto::DECIMAL(16,2));",
              {
                replacements: { idCuentaOrigen, idCuentaDestino, monto }
              }
            );

            if (realizarTransferenciaInterna[0].length > 0) {
              const movimiento = utils.convertSnakeToCamel(realizarTransferenciaInterna[0][0]);

              res.status(200).json(utils.successResponse(
                "Transferencia interna realizada correctamente.",
                { movimiento }
              ));
            } else {
              res.status(200).json(utils.errorResponse(
                "No se realizó la transferencia interna.",
                null
              ));
            }
          } else {
            res.status(200).json(utils.warningResponse(
              "No se encontró la cuenta origen y/o la cuenta destino.",
              null
            ));
          }
        }
      } else {
        res.status(200).json(utils.errorResponse(
          'No se puede realizar la transferencia interna. Autenticación no proporcionada.',
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
  async realizarTransferenciaExterna(req, res) {
    try {
      const token = req.headers.authorization;

      if (token) {
        const { idUsuario } = jwt.verify(token, process.env.SECRETJWT);
        const requiredParams = [PARAM_ENTIDAD_DESTINO, PARAM_CUENTA_DESTINO, PARAM_MONTO];

        if (utils.validateBody(req, res, requiredParams)) {
          const { entidadDestino, cuentaDestino, monto } = req.body;

          const idCuentaOrigen = await CuentasController.prototype.consultarIdCuentaIdUsuarioAUX(idUsuario);

          if (idCuentaOrigen != -1) {
            const realizarTransferenciaExterna = await sequelize.query(
              "SELECT * FROM realizar_transferencia_externa(:idCuentaOrigen::INT, :entidadDestino::VARCHAR(20), :cuentaDestino::VARCHAR(15), :monto::DECIMAL(16,2));",
              {
                replacements: { idCuentaOrigen, entidadDestino, cuentaDestino, monto }
              }
            );

            if (realizarTransferenciaExterna[0].length > 0) {
              const movimiento = utils.convertSnakeToCamel(realizarTransferenciaExterna[0][0]);

              res.status(200).json(utils.successResponse(
                "Transferencia externa realizada correctamente.",
                { movimiento }
              ));
            } else {
              res.status(200).json(utils.errorResponse(
                "No se realizó la transferencia externa.",
                null
              ));
            }
          } else {
            res.status(200).json(utils.warningResponse(
              "No se encontró la cuenta origen.",
              null
            ));
          }
        }
      } else {
        res.status(200).json(utils.errorResponse(
          'No se puede realizar la transferencia externa. Autenticación no proporcionada.',
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
  async realizarPagoFactura(req, res) {
    try {
      const token = req.headers.authorization;

      if (token) {
        const { idUsuario } = jwt.verify(token, process.env.SECRETJWT);
        const requiredParams = [PARAM_REFERENCIA, PARAM_DESCRIPCION, PARAM_MONTO];

        if (utils.validateBody(req, res, requiredParams)) {
          const { referencia, descripcion, monto } = req.body;

          const idCuentaOrigen = await CuentasController.prototype.consultarIdCuentaIdUsuarioAUX(idUsuario);

          if (idCuentaOrigen != -1) {
            const realizarPagoFactura = await sequelize.query(
              "SELECT * FROM realizar_pago_factura(:idCuentaOrigen::INT, :referencia::VARCHAR(30), :descripcion::VARCHAR(20), :monto::DECIMAL(16,2));",
              {
                replacements: { idCuentaOrigen, referencia, descripcion, monto }
              }
            );

            if (realizarPagoFactura[0].length > 0) {
              const movimiento = utils.convertSnakeToCamel(realizarPagoFactura[0][0]);

              res.status(200).json(utils.successResponse(
                "Pago de factura realizado correctamente.",
                { movimiento }
              ));
            } else {
              res.status(200).json(utils.errorResponse(
                "No se realizó el pago de factura",
                null
              ));
            }
          } else {
            res.status(200).json(utils.warningResponse(
              "No se encontró la cuenta origen.",
              null
            ));
          }
        }
      } else {
        res.status(200).json(utils.errorResponse(
          'No se puede realizar el pago de factura. Autenticación no proporcionada.',
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
  async realizarRecargaCivica(req, res) {
    try {
      const token = req.headers.authorization;

      if (token) {
        const { idUsuario } = jwt.verify(token, process.env.SECRETJWT);
        const requiredParams = [PARAM_TIPO_DOCUMENTO, PARAM_NUMERO_DOCUMENTO, PARAM_MONTO];

        if (utils.validateBody(req, res, requiredParams)) {
          const { tipoDocumento, numeroDocumento, monto } = req.body;

          const idCuentaOrigen = await CuentasController.prototype.consultarIdCuentaIdUsuarioAUX(idUsuario);

          if (idCuentaOrigen != -1) {
            const realizarRecargaCivica = await sequelize.query(
              "SELECT * FROM realizar_recarga_civica(:idCuentaOrigen::INT, :tipoDocumento::VARCHAR(2), :numeroDocumento::VARCHAR(10), :monto::DECIMAL(16,2));",
              {
                replacements: { idCuentaOrigen, tipoDocumento, numeroDocumento, monto }
              }
            );

            if (realizarRecargaCivica[0].length > 0) {
              const movimiento = utils.convertSnakeToCamel(realizarRecargaCivica[0][0]);

              res.status(200).json(utils.successResponse(
                "Recarga de tarjeta cívica realizada correctamente.",
                { movimiento }
              ));
            } else {
              res.status(200).json(utils.errorResponse(
                "No se realizó la recarga de tarjeta cívica.",
                null
              ));
            }
          } else {
            res.status(200).json(utils.warningResponse(
              "No se encontró la cuenta origen.",
              null
            ));
          }
        }
      } else {
        res.status(200).json(utils.errorResponse(
          'No se puede realizar la recarga de tarjeta cívica. Autenticación no proporcionada.',
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
  async realizarRecargaTelefonia(req, res) {
    try {
      const token = req.headers.authorization;

      if (token) {
        const { idUsuario } = jwt.verify(token, process.env.SECRETJWT);
        const requiredParams = [PARAM_OPERADOR, PARAM_NUMERO_TELEFONO, PARAM_MONTO];

        if (utils.validateBody(req, res, requiredParams)) {
          const { operador, numeroTelefono, monto } = req.body;

          const idCuentaOrigen = await CuentasController.prototype.consultarIdCuentaIdUsuarioAUX(idUsuario);

          if (idCuentaOrigen != -1) {
            const realizarRecargaTelefonia = await sequelize.query(
              "SELECT * FROM realizar_recarga_telefonia(:idCuentaOrigen::INT, :operador::VARCHAR(20), :numeroTelefono::VARCHAR(10), :monto::DECIMAL(16,2));",
              {
                replacements: { idCuentaOrigen, operador, numeroTelefono, monto }
              }
            );

            if (realizarRecargaTelefonia[0].length > 0) {
              const movimiento = utils.convertSnakeToCamel(realizarRecargaTelefonia[0][0]);

              res.status(200).json(utils.successResponse(
                "Recarga de telefonía realizada correctamente.",
                { movimiento }
              ));
            } else {
              res.status(200).json(utils.errorResponse(
                "No se realizó la recarga de telefonía.",
                null
              ));
            }
          } else {
            res.status(200).json(utils.warningResponse(
              "No se encontró la cuenta origen.",
              null
            ));
          }
        }
      } else {
        res.status(200).json(utils.errorResponse(
          'No se puede realizar la recarga de telefonía. Autenticación no proporcionada.',
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
  async realizarPagoPaqueteTelefonia(req, res) {
    try {
      const token = req.headers.authorization;

      if (token) {
        const { idUsuario } = jwt.verify(token, process.env.SECRETJWT);
        const requiredParams = [PARAM_OPERADOR, PARAM_NOMBRE_PAQUETE, PARAM_NUMERO_TELEFONO, PARAM_MONTO];

        if (utils.validateBody(req, res, requiredParams)) {
          const { operador, nombre, numeroTelefono, monto } = req.body;

          const idCuentaOrigen = await CuentasController.prototype.consultarIdCuentaIdUsuarioAUX(idUsuario);

          if (idCuentaOrigen != -1) {
            const realizarPagoPaqueteTelefonia = await sequelize.query(
              "SELECT * FROM realizar_pago_paquete_telefonia(:idCuentaOrigen::INT, :operador::VARCHAR(20), :nombre::VARCHAR(30), :numeroTelefono::VARCHAR(10), :monto::DECIMAL(16,2));",
              {
                replacements: { idCuentaOrigen, operador, nombre, numeroTelefono, monto }
              }
            );

            if (realizarPagoPaqueteTelefonia[0].length > 0) {
              const movimiento = utils.convertSnakeToCamel(realizarPagoPaqueteTelefonia[0][0]);

              res.status(200).json(utils.successResponse(
                "Pago de paquete de telefonía realizado correctamente.",
                { movimiento }
              ));
            } else {
              res.status(200).json(utils.errorResponse(
                "No se realizó el pago de paquete de telefonía.",
                null
              ));
            }
          } else {
            res.status(200).json(utils.warningResponse(
              "No se encontró la cuenta origen.",
              null
            ));
          }
        }
      } else {
        res.status(200).json(utils.errorResponse(
          'No se puede realizar el pago de paquete de telefonía. Autenticación no proporcionada.',
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

module.exports = MovimientosController;