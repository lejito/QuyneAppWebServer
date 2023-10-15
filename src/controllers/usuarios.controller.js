const { types } = require("pg");
const sequelize = require("../../db");
const Usuario = require('../models/Usuario');
const utils = require("./utils");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const PARAM_TIPO_DOCUMENTO = utils.createParam('tipoDocumento', 'string', false);
const PARAM_NUMERO_DOCUMENTO = utils.createParam('numeroDocumento', 'string', false);
const PARAM_PRIMER_NOMBRE = utils.createParam('primerNombre', 'string', false);
const PARAM_SEGUNDO_NOMBRE = utils.createParam('segundoNombre', 'string', true);
const PARAM_PRIMER_APELLIDO = utils.createParam('primerApellido', 'string', false);
const PARAM_SEGUNDO_APELLIDO = utils.createParam('segundoApellido', 'string', true);
const PARAM_FECHA_NACIMIENTO = utils.createParam('fechaNacimiento', 'string', false);
const PARAM_CORREO_ELECTRONICO = utils.createParam('correoElectronico', 'string', false);
const PARAM_CLAVE = utils.createParam('clave', 'string', false);
const PARAM_NUMERO_TELEFONO = utils.createParam('numeroTelefono', 'string', false);

class UsuariosController {
  /**
    *
    * @param {import('express').Request} req
    * @param {import('express').Response} res
    */
  async crearUsuarioYCuenta(req, res) {
    try {
      const requiredParams = [PARAM_TIPO_DOCUMENTO, PARAM_NUMERO_DOCUMENTO, PARAM_PRIMER_NOMBRE, PARAM_SEGUNDO_NOMBRE, PARAM_PRIMER_APELLIDO, PARAM_SEGUNDO_APELLIDO, PARAM_FECHA_NACIMIENTO, PARAM_CORREO_ELECTRONICO, PARAM_CLAVE, PARAM_NUMERO_TELEFONO];

      if (utils.validateBody(req, res, requiredParams)) {
        const { tipoDocumento, numeroDocumento, clave } = req.body;

        const usuarioExistenteDocumento = await sequelize.query(
          "SELECT verificar_existencia_usuario_documento($tipoDocumento, $numeroDocumento);",
          {
            bind: { tipoDocumento, numeroDocumento }
          }
        );

        const usuarioExistenteCorreo = await sequelize.query(
          "SELECT verificar_existencia_usuario_correo($correoElectronico);",
          {
            bind: { correoElectronico }
          }
        );

        const cuentaExistenteNumero = await sequelize.query(
          "SELECT verificar_existencia_cuenta_numero($numeroTelefono);",
          {
            bind: { numeroTelefono }
          }
        );

        if (usuarioExistenteDocumento[0][0]) {
          res.status(200).json(utils.errorResponse(
            "El tipo y número de documento ingresados ya están registrados en otro usuario.",
            null
          ));
        } else if (usuarioExistenteCorreo[0][0]) {
          res.status(200).json(utils.errorResponse(
            "El correo electrónico ingresado ya está registrado en otro usuario.",
            null
          ));
        } else if (cuentaExistenteNumero[0][0]) {
          res.status(200).json(utils.errorResponse(
            "El número de teléfono ingresado ya está registrado en otra cuenta.",
            null
          ));
        } else {
          const usuarioYCuentaCreados = await sequelize.query(
            "SELECT registrar_usuario_cuenta($tipoDocumento, $numeroDocumento, $primerNombre, $segundoNombre, $primerApellido, $segundoApellido, $fechaNacimiento, $correoElectronico, $clave, $numeroTelefono);",
            {
              bind: { tipoDocumento, numeroDocumento, primerNombre, segundoNombre, primerApellido, segundoApellido, fechaNacimiento, correoElectronico, clave, numeroTelefono }
            }
          );

          if (usuarioYCuentaCreados[0][0].registrar_usuario_cuenta) {
            res.status(200).json(utils.successResponse(
              "El usuario y la cuenta fueron creados correctamente. Ya puedes iniciar sesión.",
              null
            ));
          } else {
            res.status(500).json(utils.errorResponse(
              "No se pudo crear el usuario y la cuenta. Verifica la información ingresada.",
              null
            ));
          }
        }
      }
    } catch (error) {
      res.status(500).json(utils.errorResponse(
        "Ha ocurrido un error en el servidor.",
        null
      ));
    }
  }
}

module.exports = UsuariosController;