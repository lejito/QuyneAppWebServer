require('dotenv').config();
const express = require('express');
const bolsillosRouter = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const BolsillosController = require('../controllers/bolsillos.controller');

bolsillosRouter.post('/consultar', authMiddleware, BolsillosController.prototype.consultar);
bolsillosRouter.post('/crear', authMiddleware, BolsillosController.prototype.crear);
bolsillosRouter.post('/editar', authMiddleware, BolsillosController.prototype.editar);
bolsillosRouter.post('/cargar', authMiddleware, BolsillosController.prototype.cargar);
bolsillosRouter.post('/descargar', authMiddleware, BolsillosController.prototype.descargar);
bolsillosRouter.post('/verificar-saldo-suficiente', authMiddleware, BolsillosController.prototype.verificarSaldoSuficiente);
bolsillosRouter.post('/eliminar', authMiddleware, BolsillosController.prototype.eliminar);

module.exports = bolsillosRouter;