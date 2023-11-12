require('dotenv').config();
const express = require('express');
const movimientosRouter = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const MovimientosController = require('../controllers/movimientos.controller');

movimientosRouter.post('/consultar-ultimos', authMiddleware, MovimientosController.prototype.consultarUltimos);
movimientosRouter.post('/realizar-transferencia-interna', authMiddleware, MovimientosController.prototype.realizarTransferenciaInterna);
movimientosRouter.post('/realizar-transferencia-externa', authMiddleware, MovimientosController.prototype.realizarTransferenciaExterna);
movimientosRouter.post('/realizar-transferencia-externa-carga', MovimientosController.prototype.realizarTransferenciaExternaCarga);
movimientosRouter.post('/realizar-pago-factura', authMiddleware, MovimientosController.prototype.realizarPagoFactura);
movimientosRouter.post('/realizar-recarga-civica', authMiddleware, MovimientosController.prototype.realizarRecargaCivica);
movimientosRouter.post('/realizar-recarga-telefonia', authMiddleware, MovimientosController.prototype.realizarRecargaTelefonia);
movimientosRouter.post('/realizar-pago-paquete-telefonia', authMiddleware, MovimientosController.prototype.realizarPagoPaqueteTelefonia);

module.exports = movimientosRouter;