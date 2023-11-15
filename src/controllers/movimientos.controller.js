require("dotenv").config();
const axios = require("axios");
const jwt = require("jsonwebtoken");
const sequelize = require("../../db");
const utils = require("./utils");
const CuentasController = require("./cuentas.controller");
const _cuentasController = new CuentasController();

class MovimientosController {
  /**
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async consultarUltimos(req, res) {
    try {
      const token = req.headers.authorization;

      const { idUsuario } = jwt.verify(token, process.env.SECRETJWT);
      const idCuenta = await _cuentasController.consultarIdCuentaIdUsuarioAUX(
        idUsuario
      );

      const consultarUltimosMovimientos = await sequelize.query(
        "SELECT * FROM consultar_ultimos_movimientos(:idCuenta::INT, :numeroMovimientos::INT);",
        {
          replacements: { idCuenta, numeroMovimientos: 50 },
        }
      );

      if (consultarUltimosMovimientos[0].length > 0) {
        res.status(200).json(
          utils.successResponse("Movimientos recuperados correctamente.", {
            movimientos: utils.convertSnakeToCamel(
              consultarUltimosMovimientos[0]
            ),
          })
        );
      } else {
        res.status(200).json(
          utils.warningResponse("No se encontró ningún movimiento.", {
            movimientos: [],
          })
        );
      }
    } catch (error) {
      res
        .status(500)
        .json(
          utils.errorResponse("Ha ocurrido un error en el servidor.", null)
        );
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

      const { idUsuario } = jwt.verify(token, process.env.SECRETJWT);
      const { numeroTelefono, monto } = req.body;

      const idCuentaOrigen =
        await _cuentasController.consultarIdCuentaIdUsuarioAUX(idUsuario);
      const idCuentaDestino =
        await _cuentasController.consultarIdCuentaNumeroTelefonoAUX(
          numeroTelefono
        );

      if (idCuentaOrigen != -1 && idCuentaDestino != -1) {
        if (idCuentaOrigen == idCuentaDestino) {
          res
            .status(200)
            .json(
              utils.warningResponse(
                "La cuenta origen y la cuenta destino son las mismas.",
                null
              )
            );
        } else {
          const realizarTransferenciaInterna = await sequelize.query(
            "SELECT * FROM realizar_transferencia_interna(:idCuentaOrigen::INT, :idCuentaDestino::INT, :monto::DECIMAL(16,2));",
            {
              replacements: { idCuentaOrigen, idCuentaDestino, monto },
            }
          );

          if (realizarTransferenciaInterna[0].length > 0) {
            const movimiento = utils.convertSnakeToCamel(
              realizarTransferenciaInterna[0][0]
            );

            res
              .status(200)
              .json(
                utils.successResponse(
                  "Transferencia interna realizada correctamente.",
                  { movimiento }
                )
              );
          } else {
            res
              .status(200)
              .json(
                utils.errorResponse(
                  "No se realizó la transferencia interna.",
                  null
                )
              );
          }
        }
      } else {
        res
          .status(200)
          .json(
            utils.warningResponse(
              "No se encontró la cuenta origen y/o la cuenta destino.",
              null
            )
          );
      }
    } catch (error) {
      res
        .status(500)
        .json(
          utils.errorResponse("Ha ocurrido un error en el servidor.", null)
        );
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

      const { idUsuario } = jwt.verify(token, process.env.SECRETJWT);

      const { entidadDestino, cuentaDestino, monto } = req.body;

      const idCuentaOrigen =
        await _cuentasController.consultarIdCuentaIdUsuarioAUX(idUsuario);

      if (idCuentaOrigen != -1) {
        if (entidadDestino == "F4Y") {
          const consultarCuenta = await sequelize.query(
            "SELECT * FROM consultar_cuenta(:idCuenta::INT);",
            {
              replacements: { idCuenta: idCuentaOrigen },
            }
          );
          const numeroTelefono = consultarCuenta[0][0].numero_telefono;

          const { data } = await axios.post(
            `${process.env.F4YURL}/movimientos/cargar-cuenta`,
            {
              entidadOrigen: "quyne",
              cuentaOrigen: numeroTelefono,
              cuentaDestino,
              monto,
            },
            { headers: { Authorization: process.env.F4YKEY } }
          );

          if (data.error) {
            res
              .status(200)
              .json(
                utils.errorResponse(
                  "La cuenta especificada no corresponde con ninguna cuenta de F4Y.",
                  null
                )
              );
          }
        }

        const realizarTransferenciaExterna = await sequelize.query(
          "SELECT * FROM realizar_transferencia_externa(:idCuentaOrigen::INT, :entidadDestino::VARCHAR(20), :cuentaDestino::VARCHAR(15), :monto::DECIMAL(16,2));",
          {
            replacements: {
              idCuentaOrigen,
              entidadDestino,
              cuentaDestino,
              monto,
            },
          }
        );

        if (realizarTransferenciaExterna[0].length > 0) {
          const movimiento = utils.convertSnakeToCamel(
            realizarTransferenciaExterna[0][0]
          );

          res
            .status(200)
            .json(
              utils.successResponse(
                "Transferencia externa realizada correctamente.",
                { movimiento }
              )
            );
        } else {
          res
            .status(200)
            .json(
              utils.errorResponse(
                "No se realizó la transferencia externa.",
                null
              )
            );
        }
      } else {
        res
          .status(200)
          .json(
            utils.warningResponse("No se encontró la cuenta origen.", null)
          );
      }
    } catch (error) {
      res
        .status(500)
        .json(
          utils.errorResponse("Ha ocurrido un error en el servidor.", null)
        );
    }
  }

  /**
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async realizarTransferenciaExternaCarga(req, res) {
    try {
      const key = req.headers.authorization;

      if (key === process.env.F4YKEY) {
        const { numeroTelefono, entidadDestino, cuentaDestino, monto } =
          req.body;

        const idCuentaDestino =
          await _cuentasController.consultarIdCuentaNumeroTelefonoAUX(
            numeroTelefono
          );

        if (idCuentaDestino != -1) {
          const realizarTransferenciaExternaCarga = await sequelize.query(
            "SELECT * FROM realizar_transferencia_externa_carga(:idCuentaDestino::INT, :entidadDestino::VARCHAR(20), :cuentaDestino::VARCHAR(15), :monto::DECIMAL(16,2));",
            {
              replacements: {
                idCuentaDestino,
                entidadDestino,
                cuentaDestino,
                monto,
              },
            }
          );

          if (realizarTransferenciaExternaCarga[0].length > 0) {
            const movimiento = utils.convertSnakeToCamel(
              realizarTransferenciaExternaCarga[0][0]
            );

            res
              .status(200)
              .json(
                utils.successResponse(
                  "Transferencia externa realizada correctamente.",
                  { movimiento }
                )
              );
          } else {
            res
              .status(200)
              .json(
                utils.errorResponse(
                  "No se realizó la transferencia externa.",
                  null
                )
              );
          }
        } else {
          res
            .status(200)
            .json(
              utils.warningResponse(
                "El número no coincide con ninguna cuenta de QuyneApp.",
                null
              )
            );
        }
      } else {
        res
          .status(200)
          .json(
            utils.errorResponse(
              "No se puede realizar la transferencia externa. Sin autorización.",
              null
            )
          );
      }
    } catch (error) {
      res
        .status(500)
        .json(
          utils.errorResponse("Ha ocurrido un error en el servidor.", null)
        );
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

      const { idUsuario } = jwt.verify(token, process.env.SECRETJWT);
      const { referencia, descripcion, monto } = req.body;

      const idCuentaOrigen =
        await _cuentasController.consultarIdCuentaIdUsuarioAUX(idUsuario);

      if (idCuentaOrigen != -1) {
        const realizarPagoFactura = await sequelize.query(
          "SELECT * FROM realizar_pago_factura(:idCuentaOrigen::INT, :referencia::VARCHAR(30), :descripcion::VARCHAR(20), :monto::DECIMAL(16,2));",
          {
            replacements: {
              idCuentaOrigen,
              referencia,
              descripcion,
              monto,
            },
          }
        );

        if (realizarPagoFactura[0].length > 0) {
          const movimiento = utils.convertSnakeToCamel(
            realizarPagoFactura[0][0]
          );

          res
            .status(200)
            .json(
              utils.successResponse(
                "Pago de factura realizado correctamente.",
                { movimiento }
              )
            );
        } else {
          res
            .status(200)
            .json(
              utils.errorResponse("No se realizó el pago de factura", null)
            );
        }
      } else {
        res
          .status(200)
          .json(
            utils.warningResponse("No se encontró la cuenta origen.", null)
          );
      }
    } catch (error) {
      res
        .status(500)
        .json(
          utils.errorResponse("Ha ocurrido un error en el servidor.", null)
        );
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

      const { idUsuario } = jwt.verify(token, process.env.SECRETJWT);
      const { tipoDocumento, numeroDocumento, monto } = req.body;

      const idCuentaOrigen =
        await _cuentasController.consultarIdCuentaIdUsuarioAUX(idUsuario);

      if (idCuentaOrigen != -1) {
        const realizarRecargaCivica = await sequelize.query(
          "SELECT * FROM realizar_recarga_civica(:idCuentaOrigen::INT, :tipoDocumento::VARCHAR(2), :numeroDocumento::VARCHAR(10), :monto::DECIMAL(16,2));",
          {
            replacements: {
              idCuentaOrigen,
              tipoDocumento,
              numeroDocumento,
              monto,
            },
          }
        );

        if (realizarRecargaCivica[0].length > 0) {
          const movimiento = utils.convertSnakeToCamel(
            realizarRecargaCivica[0][0]
          );

          res
            .status(200)
            .json(
              utils.successResponse(
                "Recarga de tarjeta cívica realizada correctamente.",
                { movimiento }
              )
            );
        } else {
          res
            .status(200)
            .json(
              utils.errorResponse(
                "No se realizó la recarga de tarjeta cívica.",
                null
              )
            );
        }
      } else {
        res
          .status(200)
          .json(
            utils.warningResponse("No se encontró la cuenta origen.", null)
          );
      }
    } catch (error) {
      res
        .status(500)
        .json(
          utils.errorResponse("Ha ocurrido un error en el servidor.", null)
        );
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

      const { idUsuario } = jwt.verify(token, process.env.SECRETJWT);
      const { operador, numeroTelefono, monto } = req.body;

      const idCuentaOrigen =
        await _cuentasController.consultarIdCuentaIdUsuarioAUX(idUsuario);

      if (idCuentaOrigen != -1) {
        const realizarRecargaTelefonia = await sequelize.query(
          "SELECT * FROM realizar_recarga_telefonia(:idCuentaOrigen::INT, :operador::VARCHAR(20), :numeroTelefono::VARCHAR(10), :monto::DECIMAL(16,2));",
          {
            replacements: {
              idCuentaOrigen,
              operador,
              numeroTelefono,
              monto,
            },
          }
        );

        if (realizarRecargaTelefonia[0].length > 0) {
          const movimiento = utils.convertSnakeToCamel(
            realizarRecargaTelefonia[0][0]
          );

          res
            .status(200)
            .json(
              utils.successResponse(
                "Recarga de telefonía realizada correctamente.",
                { movimiento }
              )
            );
        } else {
          res
            .status(200)
            .json(
              utils.errorResponse(
                "No se realizó la recarga de telefonía.",
                null
              )
            );
        }
      } else {
        res
          .status(200)
          .json(
            utils.warningResponse("No se encontró la cuenta origen.", null)
          );
      }
    } catch (error) {
      res
        .status(500)
        .json(
          utils.errorResponse("Ha ocurrido un error en el servidor.", null)
        );
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

      const { idUsuario } = jwt.verify(token, process.env.SECRETJWT);
      const { operador, nombre, numeroTelefono, monto } = req.body;

      const idCuentaOrigen =
        await _cuentasController.consultarIdCuentaIdUsuarioAUX(idUsuario);

      if (idCuentaOrigen != -1) {
        const realizarPagoPaqueteTelefonia = await sequelize.query(
          "SELECT * FROM realizar_pago_paquete_telefonia(:idCuentaOrigen::INT, :operador::VARCHAR(20), :nombre::VARCHAR(30), :numeroTelefono::VARCHAR(10), :monto::DECIMAL(16,2));",
          {
            replacements: {
              idCuentaOrigen,
              operador,
              nombre,
              numeroTelefono,
              monto,
            },
          }
        );

        if (realizarPagoPaqueteTelefonia[0].length > 0) {
          const movimiento = utils.convertSnakeToCamel(
            realizarPagoPaqueteTelefonia[0][0]
          );

          res
            .status(200)
            .json(
              utils.successResponse(
                "Pago de paquete de telefonía realizado correctamente.",
                { movimiento }
              )
            );
        } else {
          res
            .status(200)
            .json(
              utils.errorResponse(
                "No se realizó el pago de paquete de telefonía.",
                null
              )
            );
        }
      } else {
        res
          .status(200)
          .json(
            utils.warningResponse("No se encontró la cuenta origen.", null)
          );
      }
    } catch (error) {
      res
        .status(500)
        .json(
          utils.errorResponse("Ha ocurrido un error en el servidor.", null)
        );
    }
  }
}

module.exports = MovimientosController;
