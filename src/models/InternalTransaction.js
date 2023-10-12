"use strict"
const sequelize = require("../../config/db");
const Sequelize = require("sequelize")
const { DataTypes } = require("sequelize");

const InternalTransaction = sequelize.define('transferencias_internas', {
    id_movimiento: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    cuenta_destino: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    timestamps: false, // Desactiva las marcas de tiempo automáticas (createdAt, updatedAt)
});


Account.sync().then(() => {
    console.log("Internal transaction Model synced");
}).catch((e) => { console.log(e) });
module.exports = InternalTransaction;
