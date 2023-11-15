require("dotenv").config();
const express = require("express");
const usuariosRouter = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const UsuariosController = require("../controllers/usuarios.controller");

const _usuariosController = new UsuariosController();

usuariosRouter.post(
  "/crear-usuario-cuenta",
  _usuariosController.crearUsuarioYCuenta
);

usuariosRouter.post("/iniciar-sesion", _usuariosController.iniciarSesion);

usuariosRouter.post(
  "/cerrar-sesion",
  authMiddleware,
  _usuariosController.cerrarSesion
);

usuariosRouter.post(
  "/consultar-datos",
  authMiddleware,
  _usuariosController.consultarDatos
);

usuariosRouter.post(
  "/actualizar-documento",
  authMiddleware,
  _usuariosController.actualizarDocumentoIdentidad
);

usuariosRouter.post(
  "/actualizar-nombre",
  authMiddleware,
  _usuariosController.actualizarNombreCompleto
);

usuariosRouter.post(
  "/actualizar-fecha-nacimiento",
  authMiddleware,
  _usuariosController.actualizarFechaNacimiento
);

usuariosRouter.post(
  "/actualizar-correo",
  authMiddleware,
  _usuariosController.actualizarCorreoElectronico
);

usuariosRouter.post(
  "/actualizar-clave",
  authMiddleware,
  _usuariosController.actualizarClave
);

usuariosRouter.post(
  "/consultar-registros-actividad",
  authMiddleware,
  _usuariosController.consultarRegistrosActividad
);

module.exports = usuariosRouter;
