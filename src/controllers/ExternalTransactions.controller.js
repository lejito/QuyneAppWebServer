const ExternalTransactions = require('../models/ExternalTransaction')
const { sequelize } = require("../../config/db")
class ExternalTransactionController {

    /**
      *
      * @param {import('express').Request} req
      * @param {import('express').Response} res
      */
    async create(req, res) {
        let { id_cuenta_origen, entidad_destino, id_cuenta_destino, monto } = req.body
        try {
            const transaction = await sequelize.query(`SELECT * FROM realizar_transferencia_externa(${id_cuenta_origen},'${entidad_destino}','${id_cuenta_destino}',${monto});`);
            let table = transaction[0][0]
            if (!table) {

                res.status(400).json({ ok: false, message: 'La transferencia externa no se ha podido generar, verifique si tiene saldo suficiente' });
            }
            else {
                res.status(201).json({ ok: true, message: 'La transferencia externa ha sido creada satisfactoriamente', info: table });
            }

        } catch (error) {
            res.status(error.status || 500).json({ ok: false, message: 'La transferencia externa no ha podido ser realizada, posibles conflictos en la creacion' });
        }

    }
}

module.exports = ExternalTransactionController;