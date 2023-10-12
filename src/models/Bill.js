"use strict"
const sequelize = require("../../config/db");
const Sequelize = require("sequelize")
const { DataTypes } = require("sequelize");

const Bill = sequelize.sequelize.define('facturas', {
    id_movimiento: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    descripcion: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    referencia: {
        type: DataTypes.STRING(30),
        allowNull: false,
    },
}, {
    timestamps: false, // Desactiva las marcas de tiempo automáticas (createdAt, updatedAt)
});


Bill.sync().then(() => {
    console.log("Bill Model synced");
}).catch((e) => { console.log(e) });
module.exports = Bill;
