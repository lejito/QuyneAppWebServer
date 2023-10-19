require('dotenv').config();
const jwt = require('jsonwebtoken');
const sequelize = require("../../db");
const utils = require("./utils");
const CuentasController = require('./cuentas.controller');

const PARAM_ID_BOLSILLO = utils.createParam('idBolsillo', 'number', false);
const PARAM_NOMBRE = utils.createParam('nombre', 'string', false);
const PARAM_SALDO_OBJETIVO = utils.createParam('saldoObjetivo', 'number', true);
const PARAM_MONTO = utils.createParam('monto', 'number', false);

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
        const { idUsuario } = jwt.verify(token, process.env.SECRETJWT);
        const idCuenta = await CuentasController.prototype.consultarIdCuentaIdUsuarioAUX(idUsuario);

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
        const idCuenta = await CuentasController.prototype.consultarIdCuentaIdUsuarioAUX(idUsuario);

        const requiredParams = [PARAM_NOMBRE, PARAM_SALDO_OBJETIVO];

        if (utils.validateBody(req, res, requiredParams)) {
          const { nombre, saldoObjetivo } = req.body;

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

  /**
  *
  * @param {import('express').Request} req
  * @param {import('express').Response} res
  */
  async editar(req, res) {
    try {
      const token = req.headers.authorization;

      if (token) {
        const { idUsuario } = jwt.verify(token, process.env.SECRETJWT);

        const requiredParams = [PARAM_ID_BOLSILLO, PARAM_NOMBRE, PARAM_SALDO_OBJETIVO];

        if (utils.validateBody(req, res, requiredParams)) {
          const { idBolsillo, nombre, saldoObjetivo } = req.body;

          const editarBolsillo = await sequelize.query(
            "SELECT * FROM editar_bolsillo(:idUsuario::INT, :idBolsillo::INT, :nombre::VARCHAR(20), :saldoObjetivo::DECIMAL(16,2));",
            {
              replacements: { idUsuario, idBolsillo, nombre, saldoObjetivo }
            }
          );

          if (editarBolsillo[0][0].editar_bolsillo) {

            res.status(200).json(utils.successResponse(
              "Bolsillo editado correctamente.",
              null
            ));
          } else {
            res.status(200).json(utils.warningResponse(
              "No se editó el bolsillo.",
              null
            ));
          }
        }

      } else {
        res.status(401).json(utils.errorResponse(
          'No se puede editar el bolsillo. Autenticación no proporcionada.',
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
  async verificarSaldoSuficiente(req, res) {
    try {
      const requiredParams = [PARAM_ID_BOLSILLO, PARAM_MONTO];

      if (utils.validateBody(req, res, requiredParams)) {
        const { idBolsillo, monto } = req.body;

        const verificarSaldoSuficiente = await sequelize.query(
          "SELECT verificar_saldo_suficiente_bolsillo(:idBolsillo::INT, :monto::DECIMAL(16,2));",
          {
            replacements: { idBolsillo, monto }
          }
        );

        const saldoSuficiente = verificarSaldoSuficiente[0][0].verificar_saldo_suficiente_bolsillo;

        if (saldoSuficiente != null) {
          res.status(200).json(utils.successResponse(
            "Verificación de saldo de bolsillo realizada correctamente.",
            { saldoSuficiente }
          ));
        } else {
          res.status(200).json(utils.warningResponse(
            "No se encontró ningún bolsillo.",
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
  async cargar(req, res) {
    try {
      const requiredParams = [PARAM_ID_BOLSILLO, PARAM_MONTO];

      if (utils.validateBody(req, res, requiredParams)) {
        const { idBolsillo, monto } = req.body;

        const realizarCargaBolsillo = await sequelize.query(
          "SELECT * FROM realizar_carga_bolsillo(:idBolsillo::INT, :monto::DECIMAL(16,2));",
          {
            replacements: { idBolsillo, monto }
          }
        );

        if (realizarCargaBolsillo[0].length > 0) {
          const movimiento = utils.convertSnakeToCamel(realizarCargaBolsillo[0][0]);

          res.status(200).json(utils.successResponse(
            "Carga a bolsillo realizada correctamente.",
            { movimiento }
          ));
        } else {
          res.status(200).json(utils.errorResponse(
            "No se realizó la carga a bolsillo.",
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
  async descargar(req, res) {
    try {
      const requiredParams = [PARAM_ID_BOLSILLO, PARAM_MONTO];

      if (utils.validateBody(req, res, requiredParams)) {
        const { idBolsillo, monto } = req.body;

        const realizarDescargaBolsillo = await sequelize.query(
          "SELECT * FROM realizar_descarga_bolsillo(:idBolsillo::INT, :monto::DECIMAL(16,2));",
          {
            replacements: { idBolsillo, monto }
          }
        );

        if (realizarDescargaBolsillo[0].length > 0) {
          const movimiento = utils.convertSnakeToCamel(realizarDescargaBolsillo[0][0]);

          res.status(200).json(utils.successResponse(
            "Descarda desde bolsillo realizada correctamente.",
            { movimiento }
          ));
        } else {
          res.status(200).json(utils.errorResponse(
            "No se realizó la descarga desde bolsillo. Comprueba si hay saldo disponible.",
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
  async eliminar(req, res) {
    try {
      const token = req.headers.authorization;

      if (token) {
        const { idUsuario } = jwt.verify(token, process.env.SECRETJWT);

        const requiredParams = [PARAM_ID_BOLSILLO];

        if (utils.validateBody(req, res, requiredParams)) {
          const { idBolsillo } = req.body;

          const eliminarBolsillo = await sequelize.query(
            "SELECT eliminar_bolsillo(:idUsuario::INT, :idBolsillo::INT);",
            {
              replacements: { idUsuario, idBolsillo }
            }
          );

          if (eliminarBolsillo[0][0].eliminar_bolsillo) {

            res.status(200).json(utils.successResponse(
              "Bolsillo eliminado correctamente.",
              null
            ));
          } else {
            res.status(200).json(utils.warningResponse(
              "No se eliminó el bolsillo. Verifica que no tenga saldo disponible.",
              null
            ));
          }
        }
      } else {
        res.status(401).json(utils.errorResponse(
          'No se puede eliminar el bolsillo. Autenticación no proporcionada.',
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
  async consultarUltimosMovimientos(req, res) {
    try {
      const requiredParams = [PARAM_ID_BOLSILLO]

      if (utils.validateBody(req, res, requiredParams)) {
        const { idBolsillo } = req.body;

        const consultarUltimosMovimientosBolsillo = await sequelize.query(
          "SELECT * FROM consultar_ultimos_movimientos_bolsillo(:idBolsillo::INT);",
          {
            replacements: { idBolsillo }
          }
        );

        if (consultarUltimosMovimientosBolsillo[0].length > 0) {

          res.status(200).json(utils.successResponse(
            "Movimientos del bolsillo recuperados correctamente.",
            { movimientos: utils.convertSnakeToCamel(consultarUltimosMovimientosBolsillo[0]) }
          ));
        } else {
          res.status(200).json(utils.warningResponse(
            "No se encontró ningún movimiento en el bolsillo.",
            { movimientos: [] }
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

module.exports = BolsillosController;