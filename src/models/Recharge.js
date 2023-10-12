"use strict"
const sequelize = require("../../config/db");
const Sequelize = require("sequelize")
const { DataTypes } = require("sequelize");

const Recharge = sequelize.sequelize.define('recargas', {
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


Recharge.sync().then(() => {
    console.log("Recharge Model synced");
}).catch((e) => { console.log(e) });
module.exports = Recharge;
