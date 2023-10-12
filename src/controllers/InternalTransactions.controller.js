const InternalTransactions = require('../models/InternalTransaction')
const { sequelize } = require("../../config/db")
class InternalTransactionController {

    /**
      *
      * @param {import('express').Request} req
      * @param {import('express').Response} res
      */
    async create(req, res) {
        let { id_cuenta_origen, id_cuenta_destino, monto } = req.body
        try {
            const transaction = await sequelize.query(`SELECT * FROM realizar_transferencia_interna(${id_cuenta_origen},${id_cuenta_destino},${monto});`);
            let table = transaction[0][0]
            if (!table) {
                res.status(400).json({ ok: false, message: 'La transferencia interna no se ha podido generar, verifique si tiene saldo suficiente' });
            }
            else {
                res.status(201).json({ ok: true, message: 'La transferencia interna ha sido creada satisfactoriamente', info: table });
            }

        } catch (error) {
            res.status(error.status || 500).json({ ok: false, message: 'La transferencia interna no ha podido ser realizada, posibles conflictos en la creacion' });
        }

    }
}

module.exports = InternalTransactionController;