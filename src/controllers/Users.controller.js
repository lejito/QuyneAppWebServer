const Users = require('../models/User')
const { sequelize } = require("../../config/db")
class UserController {
  /**
    *
    * @param {import('express').Request} req
    * @param {import('express').Response} res
    */
  async create(req, res) {
    let { tipo_documento, numero_documento, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, fecha_nacimiento, correo_electronico, clave, numero_telefono } = req.body
    try {

      const userCreated = await sequelize.query(`select registrar_usuario_cuenta('${tipo_documento}', '${numero_documento}', '${primer_nombre}', ${segundo_nombre ? "'" + segundo_nombre + "'" : null}, '${primer_apellido}', ${segundo_apellido ? "'" + segundo_apellido + "'" : null}, '${fecha_nacimiento}', '${correo_electronico}', '${clave}', '${numero_telefono}' );`);
      if (!userCreated[0][0].registrar_usuario_cuenta) {
        res.status(400).json({
          ok: false,
          message: "No ha sido posible crear el usuario, posibles errores en los datos de creacion",
          info: newUser
        })
      }
      else {
        res.status(201).json({
          ok: true,
          message: "El usuario se ha creado con exito"
        })
      }

    } catch (error) {
      res.status(error?.status || 500).json({
        ok: false,
        message: "Error, el usuario no pudo ser creado"
      })
    }

  }
  /**
    *
    * @param {import('express').Request} req
    * @param {import('express').Response} res
    */
  async findAll(req, res) {

    try {

      const users = await Users.findAll();
      if (!users) {
        res.status(204).json({
          ok: true,
          message: "No hay usuarios disponibles",
          info: []
        })

      }
      else {
        res.status(200).json({
          ok: true,
          message: "Usuarios recuperados correctamente",
          info: users
        });

      }
    }
    catch (error) {
      res.status(error?.status || 500).json({
        ok: false,
        message: "Error, no fue posible recuperar los usuarios"
      })

    }

  }

  /**
    *
    * @param {import('express').Request} req
    * @param {import('express').Response} res
    */
  async update(req, res) {
    let idUser = req.params.id
    let changes = req.body
    try {
      const updating = await Users.update(changes, {
        where: { id: idUser }
      });
      res.status(201).json({ ok: true, message: 'El usuario ha sido actualizado satisfactoriamente' });
    } catch (error) {
      res.status(error.status || 500).json({ ok: false, message: 'El usuario ha podido ser actualizado, posibles conflictos en la actualizacion' });
    }

  }
  /**
*
* @param {import('express').Request} req
* @param {import('express').Response} res
*/
  async findOne(req, res) {
    let idUser = req.params.id
    try {
      const user = await Users.findOne({ where: { id: idUser } });
      if (!user) { res.status(400).json({ ok: false, message: "No existe un usuario con las condicciones pedidas" }) }
      else { res.status(200).json({ ok: true, message: "El usuario ha sido encontrado correctamente", info: user }) }

    }
    catch (error) {
      res.status(error.status || 500).json({ ok: false, message: "Surgio un error al intentar realizar la busqueda" })
    }

  }


}

module.exports = UserController;