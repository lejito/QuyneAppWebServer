const Transactions = require('../models/Transaction')
const { sequelize } = require("../../config/db")
class TransactionController {
    /**
      *
      * @param {import('express').Request} req
      * @param {import('express').Response} res
      */
    async findAllByAccount(req, res) {
        try {
            const id = req.params.id
            const amount = undefined;
            const Transactions = await sequelize.query(`SELECT * FROM consultar_ultimos_movimientos(${id},${typeof amount === typeof undefined ? amount : 1000000});`);
            if (Transactions[0].length == 0) {
                res.status(200).json({
                    ok: true,
                    message: "No hay transacciones disponibles",
                    info: []
                })

            }
            else {
                res.status(200).json({
                    ok: true,
                    message: "transacciones recuperadas correctamente",
                    info: Transactions[0]
                });

            }
        }
        catch (error) {
            res.status(error?.status || 500).json({
                ok: false,
                message: "Error, no fue posible recuperar las transacciones"
            })

        }

    }

}

module.exports = TransactionController;