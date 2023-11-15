require("dotenv").config();
const express = require("express");
const cuentasRouter = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const CuentasController = require("../controllers/cuentas.controller");

const _cuentasController = new CuentasController();

cuentasRouter.get(
  "/consultar-id-cuenta-id-usuario",
  authMiddleware,
  _cuentasController.consultarIdCuentaIdUsuario
);

cuentasRouter.post(
  "/consultar-datos",
  authMiddleware,
  _cuentasController.consultarDatos
);

cuentasRouter.post(
  "/consultar-saldo",
  authMiddleware,
  _cuentasController.consultarSaldo
);

cuentasRouter.post(
  "/activar-saldo-oculto",
  authMiddleware,
  _cuentasController.activarSaldoOculto
);

cuentasRouter.post(
  "/desactivar-saldo-oculto",
  authMiddleware,
  _cuentasController.desactivarSaldoOculto
);

cuentasRouter.post(
  "/verificar-existencia-numero-telefono",
  authMiddleware,
  _cuentasController.verificarExistenciaNumeroTelefono
);

cuentasRouter.post(
  "/verificar-saldo-suficiente",
  authMiddleware,
  _cuentasController.verificarSaldoSuficiente
);

module.exports = cuentasRouter;
