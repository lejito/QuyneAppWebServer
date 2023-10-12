"use strict"
const sequelize = require("../../config/db");
const Sequelize = require("sequelize")
const { DataTypes } = require("sequelize");

const Withdraw = sequelize.sequelize.define('retiros', {
    id_movimiento: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    corresponsal: {
        type: DataTypes.STRING(30),
        allowNull: false,
    },
}, {
    timestamps: false, // Desactiva las marcas de tiempo automáticas (createdAt, updatedAt)
});


Withdraw.sync().then(() => {
    console.log("Withdraw Model synced");
}).catch((e) => { console.log(e) });
module.exports = Withdraw;
