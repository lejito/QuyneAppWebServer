require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sequelize = require("../../db");
const utils = require("./utils");

class UsuariosController {
  /**
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async crearUsuarioYCuenta(req, res) {
    try {
      const {
        tipoDocumento,
        numeroDocumento,
        primerNombre,
        segundoNombre,
        primerApellido,
        segundoApellido,
        fechaNacimiento,
        correoElectronico,
        clave,
        numeroTelefono,
      } = req.body;

      const usuarioExistenteDocumento = await sequelize.query(
        "SELECT verificar_existencia_usuario_documento(:tipoDocumento::VARCHAR(2), :numeroDocumento::VARCHAR(10));",
        {
          replacements: { tipoDocumento, numeroDocumento },
        }
      );

      const usuarioExistenteCorreo = await sequelize.query(
        "SELECT verificar_existencia_usuario_correo(:correoElectronico::VARCHAR(120));",
        {
          replacements: { correoElectronico },
        }
      );

      const cuentaExistenteNumero = await sequelize.query(
        "SELECT verificar_existencia_cuenta_numero(:numeroTelefono::VARCHAR(10));",
        {
          replacements: { numeroTelefono },
        }
      );

      if (
        usuarioExistenteDocumento[0][0].verificar_existencia_usuario_documento
      ) {
        res
          .status(200)
          .json(
            utils.errorResponse(
              "El tipo y número de documento de identidad ingresados ya están registrados en otro usuario.",
              null
            )
          );
      } else if (
        usuarioExistenteCorreo[0][0].verificar_existencia_usuario_correo
      ) {
        res
          .status(200)
          .json(
            utils.errorResponse(
              "El correo electrónico ingresado ya está registrado en otro usuario.",
              null
            )
          );
      } else if (
        cuentaExistenteNumero[0][0].verificar_existencia_cuenta_numero
      ) {
        res
          .status(200)
          .json(
            utils.errorResponse(
              "El número de teléfono ingresado ya está registrado en otra cuenta.",
              null
            )
          );
      } else {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(clave, salt);

        const usuarioYCuentaCreados = await sequelize.query(
          "SELECT registrar_usuario_cuenta(:tipoDocumento::VARCHAR(2), :numeroDocumento::VARCHAR(10), :primerNombre::VARCHAR(20), :segundoNombre::VARCHAR(20), :primerApellido::VARCHAR(20), :segundoApellido::VARCHAR(20), :fechaNacimiento::DATE, :correoElectronico::VARCHAR(120), :clave::VARCHAR(76), :numeroTelefono::VARCHAR(10));",
          {
            replacements: {
              tipoDocumento,
              numeroDocumento,
              primerNombre,
              segundoNombre,
              primerApellido,
              segundoApellido,
              fechaNacimiento,
              correoElectronico,
              clave: hash,
              numeroTelefono,
            },
          }
        );

        if (usuarioYCuentaCreados[0][0].registrar_usuario_cuenta) {
          res
            .status(200)
            .json(
              utils.successResponse(
                "El usuario y la cuenta fueron creados correctamente. Ya puedes iniciar sesión.",
                null
              )
            );
        } else {
          res
            .status(500)
            .json(
              utils.errorResponse(
                "No se pudo crear el usuario y la cuenta. Verifica la información ingresada.",
                null
              )
            );
        }
      }
    } catch (error) {
      res
        .status(500)
        .json(
          utils.errorResponse("Ha ocurrido un error en el servidor.", null)
        );
    }
  }

  /**
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async iniciarSesion(req, res) {
    try {
      const { tipoDocumento, numeroDocumento, clave } = req.body;

      const consultarClave = await sequelize.query(
        "SELECT consultar_clave(:tipoDocumento::VARCHAR(2), :numeroDocumento::VARCHAR(10));",
        {
          replacements: { tipoDocumento, numeroDocumento },
        }
      );

      const claveUsuario = consultarClave[0][0].consultar_clave;

      if (claveUsuario) {
        const claveCorrecta = await bcrypt.compare(clave, claveUsuario);

        if (claveCorrecta) {
          const consultarCodigoUsuario = await sequelize.query(
            "SELECT consultar_codigo_usuario(:tipoDocumento::VARCHAR(2), :numeroDocumento::VARCHAR(10));",
            {
              replacements: { tipoDocumento, numeroDocumento },
            }
          );

          const idUsuario =
            consultarCodigoUsuario[0][0].consultar_codigo_usuario;

          if (idUsuario != -1) {
            const token = jwt.sign({ idUsuario }, process.env.SECRETJWT, {
              expiresIn: "24h",
            });

            await sequelize.query(
              "SELECT crear_registro_actividad(:idUsuario::INT, :accion::VARCHAR(50));",
              {
                replacements: { idUsuario, accion: "Iniciar sesión" },
              }
            );

            res
              .status(200)
              .json(
                utils.successResponse(
                  "Credenciales válidas. Inicio de sesión realizado correctamente.",
                  { token }
                )
              );
          } else {
            res
              .status(200)
              .json(
                utils.errorResponse(
                  "Hubo un error al intentar recuperar el id del usuario.",
                  null
                )
              );
          }
        } else {
          res
            .status(200)
            .json(utils.errorResponse("La contraseña no es válida.", null));
        }
      } else {
        res
          .status(200)
          .json(
            utils.errorResponse(
              "El tipo y número de documento de identidad no corresponden a un usuario registrado.",
              null
            )
          );
      }
    } catch (error) {
      res
        .status(500)
        .json(
          utils.errorResponse("Ha ocurrido un error en el servidor.", null)
        );
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

      const { idUsuario } = jwt.verify(token, process.env.SECRETJWT);

      await sequelize.query(
        "SELECT crear_registro_actividad(:idUsuario::INT, :accion::VARCHAR(50));",
        {
          replacements: { idUsuario, accion: "Cerrar sesión" },
        }
      );

      res
        .status(200)
        .json(utils.successResponse("Sesión cerrada correctamente.", null));
    } catch (error) {
      res
        .status(500)
        .json(
          utils.errorResponse("Ha ocurrido un error en el servidor.", null)
        );
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

      const { idUsuario } = jwt.verify(token, process.env.SECRETJWT);

      const consultarDatos = await sequelize.query(
        "SELECT * FROM consultar_usuario(:idUsuario::INT);",
        {
          replacements: { idUsuario },
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

        res.status(200).json(
          utils.successResponse(
            "Datos del usuario recuperados correctamente.",
            {
              usuario: {
                id,
                tipoDocumento,
                numeroDocumento,
                primerNombre,
                segundoNombre,
                primerApellido,
                segundoApellido,
                fechaNacimiento,
                correoElectronico,
              },
            }
          )
        );
      } else {
        res
          .status(200)
          .json(
            utils.errorResponse(
              "No se encontró ningún usuario con el id especificado.",
              null
            )
          );
      }
    } catch (error) {
      res
        .status(500)
        .json(
          utils.errorResponse("Ha ocurrido un error en el servidor.", null)
        );
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

      const { tipoDocumento, numeroDocumento } = req.body;

      const editarDocumento = await sequelize.query(
        "SELECT actualizar_documento_identidad(:idUsuario::INT,:tipoDocumento::VARCHAR(2),:numeroDocumento::VARCHAR(10));",
        {
          replacements: { idUsuario, tipoDocumento, numeroDocumento },
        }
      );
      const documentoActualizado =
        editarDocumento[0][0].actualizar_documento_identidad;

      if (documentoActualizado) {
        res
          .status(200)
          .json(
            utils.successResponse(
              "El documento fue actualizado correctamente.",
              { documentoActualizado }
            )
          );
      } else {
        res
          .status(200)
          .json(utils.errorResponse("El documento NO fue actualizado.", null));
      }
    } catch (error) {
      res
        .status(500)
        .json(
          utils.errorResponse("Ha ocurrido un error en el servidor.", null)
        );
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

      const { primerNombre, segundoNombre, primerApellido, segundoApellido } =
        req.body;
      const editarNombreCompleto = await sequelize.query(
        "SELECT actualizar_nombre_completo(:idUsuario::INT,:primerNombre::VARCHAR(20),:segundoNombre::VARCHAR(20),:primerApellido::VARCHAR(20),:segundoApellido::VARCHAR(20));",
        {
          replacements: {
            idUsuario,
            primerNombre,
            segundoNombre,
            primerApellido,
            segundoApellido,
          },
        }
      );
      const nombreActualizado =
        editarNombreCompleto[0][0].actualizar_nombre_completo;
      if (nombreActualizado) {
        res.status(200).json(
          utils.successResponse("El nombre fue actualizado correctamente.", {
            nombreActualizado,
          })
        );
      } else {
        res
          .status(200)
          .json(utils.errorResponse("El nombre NO fue actualizado.", null));
      }
    } catch (error) {
      res
        .status(500)
        .json(
          utils.errorResponse("Ha ocurrido un error en el servidor.", null)
        );
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

      const { fechaNacimiento } = req.body;
      const editarFechaNacimiento = await sequelize.query(
        "SELECT actualizar_fecha_nacimiento(:idUsuario::INT,:fechaNacimiento::DATE);",
        {
          replacements: { idUsuario, fechaNacimiento },
        }
      );
      const fechaActualizada =
        editarFechaNacimiento[0][0].actualizar_fecha_nacimiento;

      if (fechaActualizada) {
        res
          .status(200)
          .json(
            utils.successResponse(
              "Fecha de nacimiento actualizada correctamente.",
              { fechaActualizada }
            )
          );
      } else {
        res
          .status(200)
          .json(
            utils.errorResponse(
              "La fecha de nacimiento no fue actualizada.",
              null
            )
          );
      }
    } catch (error) {
      res
        .status(500)
        .json(
          utils.errorResponse("Ha ocurrido un error en el servidor.", null)
        );
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

      const { correoElectronico } = req.body;
      const editarCorreo = await sequelize.query(
        "SELECT actualizar_correo_electronico(:idUsuario::INT,:correoElectronico::VARCHAR(120));",
        {
          replacements: { idUsuario, correoElectronico },
        }
      );
      const correoActualizado =
        editarCorreo[0][0].actualizar_correo_electronico;

      if (correoActualizado) {
        res.status(200).json(
          utils.successResponse("Correo actualizado correctamente.", {
            correoActualizado,
          })
        );
      } else {
        res
          .status(200)
          .json(utils.errorResponse("El correo no fue actualizado.", null));
      }
    } catch (error) {
      res
        .status(500)
        .json(
          utils.errorResponse("Ha ocurrido un error en el servidor.", null)
        );
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

      const { claveActual, clave } = req.body;

      const obtenerClave = await sequelize.query(
        "SELECT consultar_clave(:idUsuario::INT);",
        {
          replacements: { idUsuario },
        }
      );
      const claveActualDB = obtenerClave[0][0].consultar_clave;

      if (claveActualDB) {
        if (await bcrypt.compare(claveActual, claveActualDB)) {
          const salt = await bcrypt.genSalt(10);
          const hash = await bcrypt.hash(clave, salt);
          const actualizarClave = await sequelize.query(
            "SELECT actualizar_clave(:idUsuario::INT,:clave::VARCHAR(120));",
            {
              replacements: { idUsuario, clave: hash },
            }
          );
          const claveActualizada = actualizarClave[0][0].actualizar_clave;

          if (claveActualizada) {
            res.status(200).json(
              utils.successResponse("Contraseña actualizada correctamente.", {
                claveActualizada,
              })
            );
          } else {
            res
              .status(500)
              .json(
                utils.errorResponse(
                  "Ha ocurrido un error al intentar actualizar la contraseña.",
                  null
                )
              );
          }
        } else {
          res
            .status(200)
            .json(
              utils.errorResponse("La contraseña actual es incorrecta.", null)
            );
        }
      } else {
        res
          .status(500)
          .json(
            utils.errorResponse(
              "Ha ocurrido un error al intentar validar la contraseña actual.",
              null
            )
          );
      }
    } catch (error) {
      res
        .status(500)
        .json(
          utils.errorResponse("Ha ocurrido un error en el servidor.", null)
        );
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

      const consultarRegistrosActividad = await sequelize.query(
        "SELECT * FROM consultar_ultimos_registros(:idUsuario::INT);",
        {
          replacements: { idUsuario },
        }
      );

      if (consultarRegistrosActividad[0].length > 0) {
        res.status(200).json(
          utils.successResponse("Registros recuperados correctamente.", {
            registros: utils.convertSnakeToCamel(
              consultarRegistrosActividad[0]
            ),
          })
        );
      } else {
        res.status(200).json(
          utils.warningResponse("No se encontró ningún registro.", {
            registros: [],
          })
        );
      }
    } catch (error) {
      res
        .status(500)
        .json(
          utils.errorResponse("Ha ocurrido un error en el servidor.", null)
        );
    }
  }
}

module.exports = UsuariosController;
