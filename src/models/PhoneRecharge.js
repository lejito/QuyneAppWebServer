"use strict"
const sequelize = require("../../config/db");
const Sequelize = require("sequelize")
const { DataTypes } = require("sequelize");

const PhoneRecharge = sequelize.sequelize.define('recargas_telefonia', {
    id_movimiento: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    operador: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    numero: {
        type: DataTypes.STRING(10),
        allowNull: false,
    },
}, {
    timestamps: false, // Desactiva las marcas de tiempo automáticas (createdAt, updatedAt)
});

PhoneRecharge.sync().then(() => {
    console.log(" Phone Recharge Model synced");
}).catch((e) => { console.log(e) });
module.exports = PhoneRecharge;
