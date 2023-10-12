const PhoneBundles = require('../models/PhoneBundle')
const { sequelize } = require("../../config/db")
class PhoneBundleController {

    /**
      *
      * @param {import('express').Request} req
      * @param {import('express').Response} res
      */
    async create(req, res) {
        let { id_cuenta_origen, operador, nombre, numero_telefono, monto } = req.body
        try {
            const transaction = await sequelize.query(`SELECT * FROM realizar_pago_paquete_telefonia(${id_cuenta_origen},'${operador}','${nombre}','${numero_telefono}',${monto});`);
            let table = transaction[0][0]
            if (!table) {

                res.status(400).json({ ok: false, message: 'El pago de paquete de telefonia no se ha podido generar, verifique si tiene saldo suficiente' });
            }
            else {
                res.status(201).json({ ok: true, message: 'El pago de paquete de telefonia ha sido creada satisfactoriamente', info: table });
            }

        } catch (error) {
            res.status(error.status || 500).json({ ok: false, message: 'El pago de paquete de telefonia no ha podido ser realizada, posibles conflictos en la creacion' });
        }

    }
}

module.exports = PhoneBundleController;