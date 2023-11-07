require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sequelize = require("../../db");
const utils = require("./utils");

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
        const { tipoDocumento, numeroDocumento, primerNombre, segundoNombre, primerApellido, segundoApellido, fechaNacimiento, correoElectronico, clave, numeroTelefono } = req.body;

        const usuarioExistenteDocumento = await sequelize.query(
          "SELECT verificar_existencia_usuario_documento(:tipoDocumento::VARCHAR(2), :numeroDocumento::VARCHAR(10));",
          {
            replacements: { tipoDocumento, numeroDocumento }
          }
        );

        const usuarioExistenteCorreo = await sequelize.query(
          "SELECT verificar_existencia_usuario_correo(:correoElectronico::VARCHAR(120));",
          {
            replacements: { correoElectronico }
          }
        );

        const cuentaExistenteNumero = await sequelize.query(
          "SELECT verificar_existencia_cuenta_numero(:numeroTelefono::VARCHAR(10));",
          {
            replacements: { numeroTelefono }
          }
        );

        if (usuarioExistenteDocumento[0][0].verificar_existencia_usuario_documento) {
          res.status(200).json(utils.errorResponse(
            "El tipo y número de documento de identidad ingresados ya están registrados en otro usuario.",
            null
          ));
        } else if (usuarioExistenteCorreo[0][0].verificar_existencia_usuario_correo) {
          res.status(200).json(utils.errorResponse(
            "El correo electrónico ingresado ya está registrado en otro usuario.",
            null
          ));
        } else if (cuentaExistenteNumero[0][0].verificar_existencia_cuenta_numero) {
          res.status(200).json(utils.errorResponse(
            "El número de teléfono ingresado ya está registrado en otra cuenta.",
            null
          ));
        } else {
          const salt = await bcrypt.genSalt(10);
          const hash = await bcrypt.hash(clave, salt);

          const usuarioYCuentaCreados = await sequelize.query(
            "SELECT registrar_usuario_cuenta(:tipoDocumento::VARCHAR(2), :numeroDocumento::VARCHAR(10), :primerNombre::VARCHAR(20), :segundoNombre::VARCHAR(20), :primerApellido::VARCHAR(20), :segundoApellido::VARCHAR(20), :fechaNacimiento::DATE, :correoElectronico::VARCHAR(120), :clave::VARCHAR(76), :numeroTelefono::VARCHAR(10));",
            {
              replacements: { tipoDocumento, numeroDocumento, primerNombre, segundoNombre, primerApellido, segundoApellido, fechaNacimiento, correoElectronico, clave: hash, numeroTelefono }
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

  /**
  *
  * @param {import('express').Request} req
  * @param {import('express').Response} res
  */
  async iniciarSesion(req, res) {
    try {
      const requiredParams = [PARAM_TIPO_DOCUMENTO, PARAM_NUMERO_DOCUMENTO, PARAM_CLAVE];

      if (utils.validateBody(req, res, requiredParams)) {
        const { tipoDocumento, numeroDocumento, clave } = req.body;

        const consultarClave = await sequelize.query(
          "SELECT consultar_clave(:tipoDocumento::VARCHAR(2), :numeroDocumento::VARCHAR(10));",
          {
            replacements: { tipoDocumento, numeroDocumento }
          }
        );

        const claveUsuario = consultarClave[0][0].consultar_clave;

        if (claveUsuario) {
          const claveCorrecta = await bcrypt.compare(clave, claveUsuario);

          if (claveCorrecta) {
            const consultarCodigoUsuario = await sequelize.query(
              "SELECT consultar_codigo_usuario(:tipoDocumento::VARCHAR(2), :numeroDocumento::VARCHAR(10));",
              {
                replacements: { tipoDocumento, numeroDocumento }
              }
            );

            const idUsuario = consultarCodigoUsuario[0][0].consultar_codigo_usuario;

            if (idUsuario != -1) {
              const token = jwt.sign({ idUsuario }, process.env.SECRETJWT, { expiresIn: '24h' });

              await sequelize.query(
                "SELECT crear_registro_actividad(:idUsuario::INT, :accion::VARCHAR(50));",
                {
                  replacements: { idUsuario, accion: "Iniciar sesión" }
                }
              );

              res.status(200).json(utils.successResponse(
                "Credenciales válidas. Inicio de sesión realizado correctamente.",
                { token }
              ));
            } else {
              res.status(200).json(utils.errorResponse(
                "Hubo un error al intentar recuperar el id del usuario.",
                null
              ));
            }
          } else {
            res.status(200).json(utils.errorResponse(
              "La contraseña no es válida.",
              null
            ));
          }
        } else {
          res.status(200).json(utils.errorResponse(
            "El tipo y número de documento de identidad no corresponden a un usuario registrado.",
            null
          ));
        }
      }
    } catch (error) {
      res.status(500).json(utils.errorResponse(
        "Ha ocurrido un error en el servidor.",
        null
      ));
    }
  }

  /**
  *
  * @param {import('express').Request} req
  * @param {import('express').Response} res
  */
  async cerrarSesion(req, res) {
    try {
      const token = req.headers.authorization;

      if (token) {
        const { idUsuario } = jwt.verify(token, process.env.SECRETJWT);

        await sequelize.query(
          "SELECT crear_registro_actividad(:idUsuario::INT, :accion::VARCHAR(50));",
          {
            replacements: { idUsuario, accion: "Cerrar sesión" }
          }
        );

        res.status(200).json(utils.successResponse(
          'Sesión cerrada correctamente.',
          null
        ));
      } else {
        res.status(200).json(utils.errorResponse(
          'No se puede cerrar sesión. Autenticación no proporcionada.',
          null
        ));
      }

    } catch (error) {
      res.status(500).json(utils.errorResponse(
        "Ha ocurrido un error en el servidor.",
        null
      ));
    }
  }

  /**
  *
  * @param {import('express').Request} req
  * @param {import('express').Response} res
  */
  async consultarDatos(req, res) {
    try {
      const token = req.headers.authorization;

      if (token) {
        const { idUsuario } = jwt.verify(token, process.env.SECRETJWT);

        const consultarDatos = await sequelize.query(
          "SELECT * FROM consultar_usuario(:idUsuario::INT);",
          {
            replacements: { idUsuario }
          }
        );

        if (consultarDatos[0].length > 0) {
          const id = consultarDatos[0][0].id;
          const tipoDocumento = consultarDatos[0][0].tipo_documento;
          const numeroDocumento = consultarDatos[0][0].numero_documento;
          const primerNombre = consultarDatos[0][0].primer_nombre;
          const segundoNombre = consultarDatos[0][0].segundo_nombre;
          const primerApellido = consultarDatos[0][0].primer_apellido;
          const segundoApellido = consultarDatos[0][0].segundo_apellido;
          const fechaNacimiento = consultarDatos[0][0].fecha_nacimiento;
          const correoElectronico = consultarDatos[0][0].correo_electronico;

          res.status(200).json(utils.successResponse(
            "Datos del usuario recuperados correctamente.",
            { usuario: { id, tipoDocumento, numeroDocumento, primerNombre, segundoNombre, primerApellido, segundoApellido, fechaNacimiento, correoElectronico } }
          ));
        } else {
          res.status(200).json(utils.errorResponse(
            "No se encontró ningún usuario con el id especificado.",
            null
          ));
        }
      } else {
        res.status(200).json(utils.errorResponse(
          'No se puede recuperar los datos del usuario. Autenticación no proporcionada.',
          null
        ));
      }

    } catch (error) {
      res.status(500).json(utils.errorResponse(
        "Ha ocurrido un error en el servidor.",
        null
      ));
    }
  }

  /**
  *
  * @param {import('express').Request} req
  * @param {import('express').Response} res
  */
  async actualizarDocumentoIdentidad(req, res) {
    try {
      const token = req.headers.authorization;

      const { idUsuario } = jwt.verify(token, process.env.SECRETJWT);
      const requiredParams = [PARAM_TIPO_DOCUMENTO, PARAM_NUMERO_DOCUMENTO];

      if (utils.validateBody(req, res, requiredParams)) {
        const { tipoDocumento, numeroDocumento } = req.body;

        // Terminar funcionalidad
      }
    } catch (error) {
      res.status(500).json(utils.errorResponse(
        "Ha ocurrido un error en el servidor.",
        null
      ));
    }
  }

  /**
  *
  * @param {import('express').Request} req
  * @param {import('express').Response} res
  */
  async actualizarNombreCompleto(req, res) {
    try {
      const token = req.headers.authorization;

      const { idUsuario } = jwt.verify(token, process.env.SECRETJWT);
      const requiredParams = [PARAM_PRIMER_NOMBRE, PARAM_SEGUNDO_NOMBRE, PARAM_PRIMER_APELLIDO, PARAM_SEGUNDO_APELLIDO];

      if (utils.validateBody(req, res, requiredParams)) {
        const { primerNombre, segundoNombre, primerApellido, segundoApellido } = req.body;

        // Terminar funcionalidad
      }
    } catch (error) {
      res.status(500).json(utils.errorResponse(
        "Ha ocurrido un error en el servidor.",
        null
      ));
    }
  }

  /**
  *
  * @param {import('express').Request} req
  * @param {import('express').Response} res
  */
  async actualizarFechaNacimiento(req, res) {
    try {
      const token = req.headers.authorization;

      const { idUsuario } = jwt.verify(token, process.env.SECRETJWT);
      const requiredParams = [PARAM_FECHA_NACIMIENTO];

      if (utils.validateBody(req, res, requiredParams)) {
        const { fechaNacimiento } = req.body;

        // Terminar funcionalidad
      }
    } catch (error) {
      res.status(500).json(utils.errorResponse(
        "Ha ocurrido un error en el servidor.",
        null
      ));
    }
  }

  /**
  *
  * @param {import('express').Request} req
  * @param {import('express').Response} res
  */
  async actualizarCorreoElectronico(req, res) {
    try {
      const token = req.headers.authorization;

      const { idUsuario } = jwt.verify(token, process.env.SECRETJWT);
      const requiredParams = [PARAM_CORREO_ELECTRONICO];

      if (utils.validateBody(req, res, requiredParams)) {
        const { correoElectronico } = req.body;

      
      }
    } catch (error) {
      res.status(500).json(utils.errorResponse(
        "Ha ocurrido un error en el servidor.",
        null
      ));
    }
  }

  /**
  *
  * @param {import('express').Request} req
  * @param {import('express').Response} res
  */
  async actualizarClave(req, res) {
    try {
      const token = req.headers.authorization;

      const { idUsuario } = jwt.verify(token, process.env.SECRETJWT);
      const requiredParams = [PARAM_CORREO_ELECTRONICO];

      if (utils.validateBody(req, res, requiredParams)) {
        const { claveActual, clave } = req.body;

        // Terminar funcionalidad
      }
    } catch (error) {
      res.status(500).json(utils.errorResponse(
        "Ha ocurrido un error en el servidor.",
        null
      ));
    }
  }

  /**
  *
  * @param {import('express').Request} req
  * @param {import('express').Response} res
  */
  async consultarRegistrosActividad(req, res) {
    try {
      const token = req.headers.authorization;

      const { idUsuario } = jwt.verify(token, process.env.SECRETJWT);

      // Terminar funcionalidad (ESTA FUNCIÓN NO REQUIERE NADA EN EL BODY)
    } catch (error) {
      res.status(500).json(utils.errorResponse(
        "Ha ocurrido un error en el servidor.",
        null
      ));
    }
  }
}

module.exports = UsuariosController;