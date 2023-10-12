const ReloadCivica = require('../models/ReloadCivica')
const { sequelize } = require("../../config/db")
class ReloadCivicaController {

    /**
      *
      * @param {import('express').Request} req
      * @param {import('express').Response} res
      */
    async create(req, res) {
        let { id_cuenta_origen, tipo_documento, numero_documento, monto } = req.body
        try {
            const transaction = await sequelize.query(`SELECT * FROM realizar_recarga_civica(${id_cuenta_origen},'${tipo_documento}','${numero_documento}',${monto});`);
            let table = transaction[0][0]
            if (!table) {

                res.status(400).json({ ok: false, message: 'La recarga civica no se ha podido generar, verifique si tiene saldo suficiente' });
            }
            else {
                res.status(201).json({ ok: true, message: 'La recarga civica ha sido creada satisfactoriamente', info: table });
            }

        } catch (error) {
            res.status(error.status || 500).json({ ok: false, message: 'La recarga civica no ha podido ser realizada, posibles conflictos en la creacion' });
        }

    }
}

module.exports = ReloadCivicaController;