"use strict"
const sequelize = require("../../config/db");
const Sequelize = require("sequelize")
const { DataTypes } = require("sequelize");

const PhoneBundle = sequelize.sequelize.define('paquetes_telefonia', {
    id_movimiento: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    operador: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    nombre: {
        type: DataTypes.STRING(30),
        allowNull: false,
    },
    numero: {
        type: DataTypes.STRING(10),
        allowNull: false,
    },
}, {
    timestamps: false, // Desactiva las marcas de tiempo automáticas (createdAt, updatedAt)
});

PhoneBundle.sync().then(() => {
    console.log("Phone Bundle Model synced");
}).catch((e) => { console.log(e) });
module.exports = PhoneBundle;
