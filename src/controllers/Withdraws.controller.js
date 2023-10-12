const Withdraws = require('../models/Withdraw')
const { sequelize } = require("../../config/db")
class WithdrawController {

    /**
      *
      * @param {import('express').Request} req
      * @param {import('express').Response} res
      */
    async create(req, res) {
        let { id_cuenta_origen, corresponsal, monto } = req.body
        try {
            const transaction = await sequelize.query(`SELECT * FROM realizar_retiro_cuenta(${id_cuenta_origen},'${corresponsal}',${monto});`);
            let table = transaction[0][0]
            if (!table) {

                res.status(400).json({ ok: false, message: 'El retiro no se ha podido generar, verifique si tiene saldo suficiente' });
            }
            else {
                res.status(201).json({ ok: true, message: 'El retiro ha sido creada satisfactoriamente', info: table });
            }

        } catch (error) {
            res.status(error.status || 500).json({ ok: false, message: 'El retiro no ha podido ser realizada, posibles conflictos en la creacion' });
        }

    }
}

module.exports = WithdrawController;