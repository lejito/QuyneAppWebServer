require('dotenv').config();
const express = require('express');
const usuariosRouter = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const UsuariosController = require('../controllers/usuarios.controller');

usuariosRouter.post('/crearUsuarioCuenta', UsuariosController.crearUsuarioYCuenta);

// usuariosRouter.get('/prueba', authMiddleware([process.env.ROL_ADMINISTRADOR, process.env.ROL_ESTUDIANTE]), async (req, res) => {
//     res.status(200).json({ message: "Ok" });
// })

module.exports = usuariosRouter;