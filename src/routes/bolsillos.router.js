require('dotenv').config();
const express = require('express');
const bolsillosRouter = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const BolsillosController = require('../controllers/bolsillos.controller');

bolsillosRouter.post('/consultar', authMiddleware, BolsillosController.prototype.consultar);
bolsillosRouter.post('/crear', authMiddleware, BolsillosController.prototype.crear);

module.exports = bolsillosRouter;