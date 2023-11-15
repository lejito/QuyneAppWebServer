require("dotenv").config();
const express = require("express");
const utils = require("../controllers/utils");
const authMiddleware = require("../middlewares/auth.middleware");
const validatorMiddleware = require("../middlewares/validator.middleware");
const UsuariosController = require("../controllers/usuarios.controller");

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
const PARAM_PRIMER_NOMBRE = utils.createParam("primerNombre", "string", false);
const PARAM_SEGUNDO_NOMBRE = utils.createParam("segundoNombre", "string", true);
const PARAM_PRIMER_APELLIDO = utils.createParam(
  "primerApellido",
  "string",
  false
);
const PARAM_SEGUNDO_APELLIDO = utils.createParam(
  "segundoApellido",
  "string",
  true
);
const PARAM_FECHA_NACIMIENTO = utils.createParam(
  "fechaNacimiento",
  "string",
  false
);
const PARAM_CORREO_ELECTRONICO = utils.createParam(
  "correoElectronico",
  "string",
  false
);
const PARAM_CLAVE = utils.createParam("clave", "string", false);
const PARAM_CLAVE_ACTUAL = utils.createParam("claveActual", "string", false);
const PARAM_NUMERO_TELEFONO = utils.createParam(
  "numeroTelefono",
  "string",
  false
);

const _usuariosController = new UsuariosController();
const usuariosRouter = express.Router();

usuariosRouter.post(
  "/crear-usuario-cuenta",
  [
    validatorMiddleware([
      PARAM_TIPO_DOCUMENTO,
      PARAM_NUMERO_DOCUMENTO,
      PARAM_PRIMER_NOMBRE,
      PARAM_SEGUNDO_NOMBRE,
      PARAM_PRIMER_APELLIDO,
      PARAM_SEGUNDO_APELLIDO,
      PARAM_FECHA_NACIMIENTO,
      PARAM_CORREO_ELECTRONICO,
      PARAM_CLAVE,
      PARAM_NUMERO_TELEFONO,
    ]),
  ],
  _usuariosController.crearUsuarioYCuenta
);

usuariosRouter.post(
  "/iniciar-sesion",
  validatorMiddleware([
    PARAM_TIPO_DOCUMENTO,
    PARAM_NUMERO_DOCUMENTO,
    PARAM_CLAVE,
  ]),
  _usuariosController.iniciarSesion
);

usuariosRouter.post(
  "/cerrar-sesion",
  [authMiddleware],
  _usuariosController.cerrarSesion
);

usuariosRouter.post(
  "/consultar-datos",
  [authMiddleware],
  _usuariosController.consultarDatos
);

usuariosRouter.post(
  "/actualizar-documento",
  [
    authMiddleware,
    validatorMiddleware([PARAM_TIPO_DOCUMENTO, PARAM_NUMERO_DOCUMENTO]),
  ],
  _usuariosController.actualizarDocumentoIdentidad
);

usuariosRouter.post(
  "/actualizar-nombre",
  [
    authMiddleware,
    validatorMiddleware([
      PARAM_PRIMER_NOMBRE,
      PARAM_SEGUNDO_NOMBRE,
      PARAM_PRIMER_APELLIDO,
      PARAM_SEGUNDO_APELLIDO,
    ]),
  ],
  _usuariosController.actualizarNombreCompleto
);

usuariosRouter.post(
  "/actualizar-fecha-nacimiento",
  [authMiddleware, validatorMiddleware([PARAM_FECHA_NACIMIENTO])],
  _usuariosController.actualizarFechaNacimiento
);

usuariosRouter.post(
  "/actualizar-correo",
  [authMiddleware, validatorMiddleware([PARAM_CORREO_ELECTRONICO])],
  _usuariosController.actualizarCorreoElectronico
);

usuariosRouter.post(
  "/actualizar-clave",
  [authMiddleware, validatorMiddleware([PARAM_CLAVE_ACTUAL, PARAM_CLAVE])],
  _usuariosController.actualizarClave
);

usuariosRouter.post(
  "/consultar-registros-actividad",
  [authMiddleware],
  _usuariosController.consultarRegistrosActividad
);

module.exports = usuariosRouter;
