"use strict"
const sequelize = require("../../config/db");
const Sequelize = require("sequelize")
const { DataTypes } = require("sequelize");

const PocketTransactions = sequelize.sequelize.define('transferencias_bolsillosmovimientos', {
    id_movimiento: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    id_bolsillo: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    tipo: {
        type: DataTypes.STRING(10),
        allowNull: false,
        validate: {
            isIn: [['Carga', 'Descarga']],
        }
    }

}
    , {
        timestamps: false
    });


PocketTransactions.sync().then(() => {
    console.log("Pocket transaction Model synced");
}).catch((e) => { console.log(e) });
module.exports = PocketTransactions;