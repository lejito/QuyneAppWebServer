require("dotenv").config();
const express = require("express");
const movimientosRouter = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const MovimientosController = require("../controllers/movimientos.controller");

const _movimientosController = new MovimientosController();

movimientosRouter.post(
  "/consultar-ultimos",
  authMiddleware,
  _movimientosController.consultarUltimos
);

movimientosRouter.post(
  "/realizar-transferencia-interna",
  authMiddleware,
  _movimientosController.realizarTransferenciaInterna
);

movimientosRouter.post(
  "/realizar-transferencia-externa",
  authMiddleware,
  _movimientosController.realizarTransferenciaExterna
);

movimientosRouter.post(
  "/realizar-transferencia-externa-carga",
  _movimientosController.realizarTransferenciaExternaCarga
);

movimientosRouter.post(
  "/realizar-pago-factura",
  authMiddleware,
  _movimientosController.realizarPagoFactura
);

movimientosRouter.post(
  "/realizar-recarga-civica",
  authMiddleware,
  _movimientosController.realizarRecargaCivica
);

movimientosRouter.post(
  "/realizar-recarga-telefonia",
  authMiddleware,
  _movimientosController.realizarRecargaTelefonia
);

movimientosRouter.post(
  "/realizar-pago-paquete-telefonia",
  authMiddleware,
  _movimientosController.realizarPagoPaqueteTelefonia
);

module.exports = movimientosRouter;
