const Accounts = require('../models/Account')
const { sequelize } = require("../../config/db")
class AccountController {
    /**
      *
      * @param {import('express').Request} req
      * @param {import('express').Response} res
      */
    async findAll(req, res) {

        try {

            const accounts = await Accounts.findAll();
            if (!accounts) {
                res.status(204).json({
                    ok: true,
                    message: "No hay cuentas disponibles",
                    info: []
                })

            }
            else {
                res.status(200).json({
                    ok: true,
                    message: "cuentas recuperadas correctamente",
                    info: accounts
                });

            }
        }
        catch (error) {
            res.status(error?.status || 500).json({
                ok: false,
                message: "Error, no fue posible recuperar las cuentas"
            })

        }

    }

    /**
      *
      * @param {import('express').Request} req
      * @param {import('express').Response} res
      */
    async update(req, res) {
        let idAccount = req.params.id
        let changes = req.body
        try {
            const updating = await Accounts.update(changes, {
                where: { id: idAccount }
            });
            res.status(201).json({ ok: true, message: 'La cuenta ha sido actualizada satisfactoriamente' });
        } catch (error) {
            res.status(error.status || 500).json({ ok: false, message: 'La cuenta no ha podido ser actualizada, posibles conflictos en la actualizacion' });
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
            const account = await Accounts.findOne({ where: { id_usuario: idUser } });
            if (!account) { res.status(400).json({ ok: false, message: "No existe un cuenta con las condicciones pedidas" }) }
            else { res.status(200).json({ ok: true, message: "La cuenta ha sido encontrada correctamente", info: account }) }

        }
        catch (error) {
            res.status(error.status || 500).json({ ok: false, message: "Surgio un error al intentar realizar la busqueda" })
        }

    }


}

module.exports = AccountController;