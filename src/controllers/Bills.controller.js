const Bills = require('../models/Bill')
const { sequelize } = require("../../config/db")
class BillController {

    /**
      *
      * @param {import('express').Request} req
      * @param {import('express').Response} res
      */
    async create(req, res) {
        let { id_cuenta_origen, referencia, descripcion, monto } = req.body
        try {
            const transaction = await sequelize.query(`SELECT * FROM realizar_pago_factura(${id_cuenta_origen},'${referencia}','${descripcion}',${monto});`);
            let table = transaction[0][0]
            if (!table) {

                res.status(400).json({ ok: false, message: 'El pago de la factura no se ha podido generar, verifique si tiene saldo suficiente' });
            }
            else {
                res.status(201).json({ ok: true, message: 'El pago de la factura ha sido creada satisfactoriamente', info: table });
            }

        } catch (error) {
            res.status(error.status || 500).json({ ok: false, message: 'El pago de la factura no ha podido ser realizada, posibles conflictos en la creacion' });
        }

    }
}

module.exports = BillController;