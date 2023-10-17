require('dotenv').config();
const express = require('express');
const cuentasRouter = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const CuentasController = require('../controllers/cuentas.controller');

cuentasRouter.get('/consultar-id-cuenta-id-usuario', authMiddleware, CuentasController.prototype.consultarIdCuentaIdUsuario);
cuentasRouter.post('/consultar-datos', authMiddleware, CuentasController.prototype.consultarDatos);
cuentasRouter.post('/consultar-saldo', authMiddleware, CuentasController.prototype.consultarSaldo);
cuentasRouter.post('/activar-saldo-oculto', authMiddleware, CuentasController.prototype.activarSaldoOculto);
cuentasRouter.post('/desactivar-saldo-oculto', authMiddleware, CuentasController.prototype.desactivarSaldoOculto);

module.exports = cuentasRouter;