require("dotenv").config();
const express = require("express");
const bolsillosRouter = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const BolsillosController = require("../controllers/bolsillos.controller");

const _bolsillosController = new BolsillosController();

bolsillosRouter.post(
  "/consultar",
  authMiddleware,
  _bolsillosController.consultar
);

bolsillosRouter.post("/crear", authMiddleware, _bolsillosController.crear);

bolsillosRouter.post("/editar", authMiddleware, _bolsillosController.editar);

bolsillosRouter.post("/cargar", authMiddleware, _bolsillosController.cargar);

bolsillosRouter.post(
  "/descargar",
  authMiddleware,
  _bolsillosController.descargar
);

bolsillosRouter.post(
  "/verificar-saldo-suficiente",
  authMiddleware,
  _bolsillosController.verificarSaldoSuficiente
);

bolsillosRouter.post(
  "/eliminar",
  authMiddleware,
  _bolsillosController.eliminar
);

bolsillosRouter.post(
  "/consultar-ultimos-movimientos",
  authMiddleware,
  _bolsillosController.consultarUltimosMovimientos
);

module.exports = bolsillosRouter;
