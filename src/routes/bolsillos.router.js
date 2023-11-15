require("dotenv").config();
const express = require("express");
const utils = require("../controllers/utils");
const authMiddleware = require("../middlewares/auth.middleware");
const validatorMiddleware = require("../middlewares/validator.middleware");
const BolsillosController = require("../controllers/bolsillos.controller");

const PARAM_ID_BOLSILLO = utils.createParam("idBolsillo", "number", false);
const PARAM_NOMBRE = utils.createParam("nombre", "string", false);
const PARAM_SALDO_OBJETIVO = utils.createParam("saldoObjetivo", "number", true);
const PARAM_MONTO = utils.createParam("monto", "number", false);

const _bolsillosController = new BolsillosController();
const bolsillosRouter = express.Router();

bolsillosRouter.get(
  "/consultar",
  [authMiddleware],
  _bolsillosController.consultar
);

bolsillosRouter.post(
  "/crear",
  [authMiddleware, validatorMiddleware([PARAM_NOMBRE, PARAM_SALDO_OBJETIVO])],
  _bolsillosController.crear
);

bolsillosRouter.put(
  "/editar",
  [
    authMiddleware,
    validatorMiddleware([
      PARAM_ID_BOLSILLO,
      PARAM_NOMBRE,
      PARAM_SALDO_OBJETIVO,
    ]),
  ],
  _bolsillosController.editar
);

bolsillosRouter.post(
  "/verificar-saldo-suficiente",
  [authMiddleware, validatorMiddleware([PARAM_ID_BOLSILLO, PARAM_MONTO])],
  _bolsillosController.verificarSaldoSuficiente
);

bolsillosRouter.post(
  "/cargar",
  [authMiddleware, validatorMiddleware([PARAM_ID_BOLSILLO, PARAM_MONTO])],
  _bolsillosController.cargar
);

bolsillosRouter.post(
  "/descargar",
  [authMiddleware, validatorMiddleware([PARAM_ID_BOLSILLO, PARAM_MONTO])],
  _bolsillosController.descargar
);

bolsillosRouter.delete(
  "/eliminar",
  [authMiddleware, validatorMiddleware([PARAM_ID_BOLSILLO])],
  _bolsillosController.eliminar
);

bolsillosRouter.post(
  "/consultar-ultimos-movimientos",
  [authMiddleware, validatorMiddleware([PARAM_ID_BOLSILLO])],
  _bolsillosController.consultarUltimosMovimientos
);

module.exports = bolsillosRouter;
