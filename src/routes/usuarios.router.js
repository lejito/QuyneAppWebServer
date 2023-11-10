require('dotenv').config();
const express = require('express');
const usuariosRouter = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const UsuariosController = require('../controllers/usuarios.controller');

usuariosRouter.post('/crear-usuario-cuenta', UsuariosController.prototype.crearUsuarioYCuenta);
usuariosRouter.post('/iniciar-sesion', UsuariosController.prototype.iniciarSesion);
usuariosRouter.post('/cerrar-sesion', authMiddleware, UsuariosController.prototype.cerrarSesion);
usuariosRouter.post('/consultar-datos', authMiddleware, UsuariosController.prototype.consultarDatos);
usuariosRouter.post('/actualizar-nombre', authMiddleware, UsuariosController.prototype.actualizarNombreCompleto);
usuariosRouter.post('/actualizar-fecha-nacimiento', authMiddleware, UsuariosController.prototype.actualizarFechaNacimiento);
usuariosRouter.post('/actualizar-correo', authMiddleware, UsuariosController.prototype.actualizarCorreoElectronico);
usuariosRouter.post('/actualizar-documento', authMiddleware, UsuariosController.prototype.actualizarDocumentoIdentidad);
usuariosRouter.post('/consultar-registros-actividad', authMiddleware, UsuariosController.prototype.consultarRegistrosActividad);

module.exports = usuariosRouter;

