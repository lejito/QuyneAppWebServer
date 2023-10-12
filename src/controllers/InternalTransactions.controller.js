const InternalTransactions = require('../models/Account')
const { sequelize } = require("../../config/db")
class AccountController {

    /**
      *
      * @param {import('express').Request} req
      * @param {import('express').Response} res
      */
    async create(req, res) {
        let { id_cuenta_origen, id_cuenta_destino, monto } = req.body
        try {
            const updating = await sequelize.query(`SELECT * FROM realizar_transferencia_interna(${id_cuenta_origen},${id_cuenta_destino},${monto});`);
            res.status(201).json({ ok: true, message: 'La transferencia interna ha sido creada satisfactoriamente' });
        } catch (error) {
            res.status(error.status || 500).json({ ok: false, message: 'La transferencia interna no ha podido ser realizada, posibles conflictos en la creacion' });
        }

    }
}

module.exports = AccountController;