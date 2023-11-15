require("dotenv").config();
const express = require("express");
const utils = require("../controllers/utils");
const authMiddleware = require("../middlewares/auth.middleware");
const validatorMiddleware = require("../middlewares/validator.middleware");
const MovimientosController = require("../controllers/movimientos.controller");

const PARAM_NUMERO_TELEFONO = utils.createParam(
  "numeroTelefono",
  "string",
  false
);
const PARAM_ENTIDAD_DESTINO = utils.createParam(
  "entidadDestino",
  "string",
  false
);
const PARAM_CUENTA_DESTINO = utils.createParam(
  "cuentaDestino",
  "string",
  false
);
const PARAM_REFERENCIA = utils.createParam("referencia", "string", false);
const PARAM_DESCRIPCION = utils.createParam("descripcion", "string", false);
const PARAM_TIPO_DOCUMENTO = utils.createParam(
  "tipoDocumento",
  "string",
  false
);
const PARAM_NUMERO_DOCUMENTO = utils.createParam(
  "numeroDocumento",
  "string",
  false
);
const PARAM_OPERADOR = utils.createParam("operador", "string", false);
const PARAM_NOMBRE_PAQUETE = utils.createParam("nombre", "string", false);
const PARAM_MONTO = utils.createParam("monto", "number", false);

const _movimientosController = new MovimientosController();
const movimientosRouter = express.Router();

movimientosRouter.get(
  "/consultar-ultimos",
  [authMiddleware],
  _movimientosController.consultarUltimos
);

movimientosRouter.post(
  "/realizar-transferencia-interna",
  [authMiddleware, validatorMiddleware([PARAM_NUMERO_TELEFONO, PARAM_MONTO])],
  _movimientosController.realizarTransferenciaInterna
);

movimientosRouter.post(
  "/realizar-transferencia-externa",
  [
    authMiddleware,
    validatorMiddleware([
      PARAM_ENTIDAD_DESTINO,
      PARAM_CUENTA_DESTINO,
      PARAM_MONTO,
    ]),
  ],
  _movimientosController.realizarTransferenciaExterna
);

movimientosRouter.post(
  "/realizar-transferencia-externa-carga",
  [
    validatorMiddleware([
      PARAM_NUMERO_TELEFONO,
      PARAM_ENTIDAD_DESTINO,
      PARAM_CUENTA_DESTINO,
      PARAM_MONTO,
    ]),
  ],
  _movimientosController.realizarTransferenciaExternaCarga
);

movimientosRouter.post(
  "/realizar-pago-factura",
  [
    authMiddleware,
    validatorMiddleware([PARAM_REFERENCIA, PARAM_DESCRIPCION, PARAM_MONTO]),
  ],
  _movimientosController.realizarPagoFactura
);

movimientosRouter.post(
  "/realizar-recarga-civica",
  [
    authMiddleware,
    validatorMiddleware([
      PARAM_TIPO_DOCUMENTO,
      PARAM_NUMERO_DOCUMENTO,
      PARAM_MONTO,
    ]),
  ],
  _movimientosController.realizarRecargaCivica
);

movimientosRouter.post(
  "/realizar-recarga-telefonia",
  [
    authMiddleware,
    validatorMiddleware([PARAM_OPERADOR, PARAM_NUMERO_TELEFONO, PARAM_MONTO]),
  ],
  _movimientosController.realizarRecargaTelefonia
);

movimientosRouter.post(
  "/realizar-pago-paquete-telefonia",
  [
    authMiddleware,
    validatorMiddleware([
      PARAM_OPERADOR,
      PARAM_NOMBRE_PAQUETE,
      PARAM_NUMERO_TELEFONO,
      PARAM_MONTO,
    ]),
  ],
  _movimientosController.realizarPagoPaqueteTelefonia
);

module.exports = movimientosRouter;
