"use strict"
const sequelize = require("../../config/db");
const Sequelize = require("sequelize")
const { DataTypes } = require("sequelize");


const Pockets = sequelize.sequelize.define('bolsillo', {
    id_cuenta: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    nombre: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    saldo_disponible: {
        type: DataTypes.DECIMAL(16, 2),
        allowNull: false,
        defaultValue: 0,
    },
    saldo_objetivo: {
        type: DataTypes.DECIMAL(16, 2),
        allowNull: true,
        defaultValue: null,
    },
    eliminado: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    tableName: 'bolsillos',
    timestamps: false, // Desactiva las marcas de tiempo automáticas (createdAt, updatedAt)
});

Pockets.sync().then(() => {
    console.log("Pockets Model synced");
}).catch((e) => { console.log(e) });
module.exports = Pockets;