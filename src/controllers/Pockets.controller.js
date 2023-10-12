const Pockets = require('../models/Pocket')
const Accounts = require('../models/Account')
const { sequelize } = require("../../config/db")

async function getUserId(idPocket) {
    let { id_cuenta } = await Pockets.findOne({ where: { id: idPocket } });
    let { id_usuario } = await Accounts.findOne({ where: { id: id_cuenta } });
    return id_usuario
}

class PocketController {

    /**
      *
      * @param {import('express').Request} req
      * @param {import('express').Response} res
      */
    async create(req, res) {
        let { id_usuario, id_cuenta, nombre, saldo_objetivo } = req.body
        try {
            const PocketCreated = await sequelize.query(`select * from crear_bolsillo(${id_usuario},${id_cuenta},'${nombre}',${saldo_objetivo ? saldo_objetivo : null} );`);

            if (!PocketCreated[0][0]) {
                res.status(400).json({
                    ok: false,
                    message: "No ha sido posible crear el bolsillo, posibles errores en los datos de creacion"
                })
            }
            else {
                res.status(201).json({
                    ok: true,
                    message: "El bolsillo se ha creado con exito",
                    info: PocketCreated[0][0]
                })
            }

        } catch (error) {
            res.status(error?.status || 500).json({
                ok: false,
                message: "Error, el bolsillo no pudo ser creado"
            })
        }

    }
    /**
      *
      * @param {import('express').Request} req
      * @param {import('express').Response} res
      */
    async findAll(req, res) {
        const idAccount = req.params.id
        try {
            const Pockets = await sequelize.query(`SELECT * from consultar_bolsillos(${idAccount})`);
            if (Pockets.length == 0) {
                res.status(200).json({
                    ok: true,
                    message: "No hay bolsillos disponibles",
                    info: []
                })

            }
            else {
                res.status(200).json({
                    ok: true,
                    message: "bolsillos recuperados correctamente",
                    info: Pockets[0]
                });

            }
        }
        catch (error) {
            res.status(error?.status || 500).json({
                ok: false,
                message: "Error, no fue posible recuperar los bolsillos"
            })

        }

    }


    /**
      *
      * @param {import('express').Request} req
      * @param {import('express').Response} res
      */
    async update(req, res) {
        let idPocket = req.params.id
        let { newName, amount } = req.body
        const idUser = await getUserId(idPocket);
        try {

            if (newName) await sequelize.query(`SELECT editar_nombre_bolsillo(${idUser},${idPocket},'${newName}')`)
            if (amount) {
                if (amount > 0) {
                    await sequelize.query(`SELECT realizar_carga_bolsillo(${idPocket},${amount})`)
                }
                else {
                    await sequelize.query(`SELECT realizar_descarga_bolsillo(${idPocket},${amount * -1})`)
                }
            }
            res.status(201).json({ ok: true, message: 'El bolsillo ha sido actualizado satisfactoriamente' });
        } catch (error) {
            res.status(error.status || 500).json({ ok: false, message: 'El bolsillo no ha podido ser actualizado, posibles conflictos en la actualizacion' });
        }

    }

    /**
  *
  * @param {import('express').Request} req
  * @param {import('express').Response} res
  */
    async findOne(req, res) {
        let idPocket = req.params.id
        try {
            const Pocket = await sequelize.query(`select * from consultar_datos_bolsillo(${idPocket})`);
            if (!Pocket[0][0]) { res.status(400).json({ ok: false, message: "No existe un bolsillo con las condicciones pedidas" }) }
            else { res.status(200).json({ ok: true, message: "El bolsillo ha sido encontrado correctamente", info: Pocket[0][0] }) }

        }
        catch (error) {
            res.status(error.status || 500).json({ ok: false, message: "Surgio un error al intentar realizar la busqueda" })
        }

    }
    /**
    *
    * @param {import('express').Request} req
    * @param {import('express').Response} res
    */
    async delete(req, res) {
        let idPocket = req.params.id

        try {
            let idUser = await getUserId(idPocket);
            const PocketDeleted = await sequelize.query(`SELECT eliminar_bolsillo(${idUser},${idPocket});`);
            if (!PocketDeleted[0][0].eliminar_bolsillo) { res.status(400).json({ ok: false, message: "No fue posible eliminar el bolsillo, asegurese de no tener saldo para poder eliminar el bolsillo" }) }
            else { res.status(200).json({ ok: true, message: "El bolsillo ha sido eliminado correctamente" }) }

        }
        catch (error) {
            res.status(error.status || 500).json({ ok: false, message: "Surgio un error al intentar realizar la busqueda" })
        }

    }
}
module.exports = PocketController;