"use strict"
const sequelize = require("../../config/db");
const Sequelize = require("sequelize")
const { DataTypes } = require("sequelize");


const ExternalTransaction = sequelize.sequelize.define('transferencias_externas', {
    id_movimiento: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    entidad_destino: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    cuenta_destino: {
        type: DataTypes.STRING(15),
        allowNull: false,
    },
}, {
    timestamps: false, // Desactiva las marcas de tiempo automáticas (createdAt, updatedAt)
});

ExternalTransaction.sync().then(() => {
    console.log("External transaction Model synced");
}).catch((e) => { console.log(e) });
module.exports = ExternalTransaction;
