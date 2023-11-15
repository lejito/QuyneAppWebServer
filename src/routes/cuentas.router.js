require("dotenv").config();
const express = require("express");
const utils = require("../controllers/utils");
const authMiddleware = require("../middlewares/auth.middleware");
const validatorMiddleware = require("../middlewares/validator.middleware");
const CuentasController = require("../controllers/cuentas.controller");

const PARAM_NUMERO_TELEFONO = utils.createParam(
  "numeroTelefono",
  "string",
  false
);
const PARAM_MONTO = utils.createParam("monto", "number", false);

const _cuentasController = new CuentasController();
const cuentasRouter = express.Router();

cuentasRouter.get(
  "/consultar-id-cuenta-id-usuario",
  [authMiddleware],
  _cuentasController.consultarIdCuentaIdUsuario
);

cuentasRouter.post(
  "/consultar-datos",
  [authMiddleware],
  _cuentasController.consultarDatos
);

cuentasRouter.post(
  "/consultar-saldo",
  [authMiddleware],
  _cuentasController.consultarSaldo
);

cuentasRouter.post(
  "/activar-saldo-oculto",
  [authMiddleware],
  _cuentasController.activarSaldoOculto
);

cuentasRouter.post(
  "/desactivar-saldo-oculto",
  [authMiddleware],
  _cuentasController.desactivarSaldoOculto
);

cuentasRouter.post(
  "/verificar-existencia-numero-telefono",
  [authMiddleware, validatorMiddleware([PARAM_NUMERO_TELEFONO])],
  _cuentasController.verificarExistenciaNumeroTelefono
);

cuentasRouter.post(
  "/verificar-saldo-suficiente",
  [authMiddleware, validatorMiddleware([PARAM_MONTO])],
  _cuentasController.verificarSaldoSuficiente
);

module.exports = cuentasRouter;
