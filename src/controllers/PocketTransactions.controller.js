const PocketTransactions = require('../models/PocketTransaction')
const { sequelize } = require("../../config/db")
class PocketTransactionController {
    /**
      *
      * @param {import('express').Request} req
      * @param {import('express').Response} res
      */
    async findAllByPocket(req, res) {
        try {
            const id = req.params.id
            const PocketTransactions = await sequelize.query(`SELECT * FROM consultar_ultimos_movimientos_bolsillo(${id});`);
            if (PocketTransactions[0].length == 0) {
                res.status(200).json({
                    ok: true,
                    message: "No hay transacciones del bolsillo disponibles",
                    info: []
                })
            }
            else {
                res.status(200).json({
                    ok: true,
                    message: "transacciones del bolsillo recuperadas correctamente",
                    info: PocketTransactions[0]
                });

            }
        }
        catch (error) {
            res.status(error?.status || 500).json({
                ok: false,
                message: "Error, no fue posible recuperar las transacciones del bolsillo"
            })

        }

    }

}

module.exports = PocketTransactionController;