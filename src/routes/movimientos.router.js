require('dotenv').config();
const express = require('express');
const movimientosRouter = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const MovimientosController = require('../controllers/movimientos.controller');

movimientosRouter.post('/consultar-ultimos', authMiddleware, MovimientosController.prototype.consultarUltimos);

module.exports = movimientosRouter;