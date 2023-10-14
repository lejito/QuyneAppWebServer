"use strict"
const sequelize = require("../../config/db");
const Sequelize = require("sequelize")
const { DataTypes } = require("sequelize");

const Account = sequelize.sequelize.define('cuentas', {
    numero_telefono: {
        type: DataTypes.STRING(10),
        allowNull: false,
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    saldo_disponible: {
        type: DataTypes.DECIMAL(16, 2),
        allowNull: false,
        defaultValue: 0,
    },
    saldo_oculto: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    habilitada: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    fecha_creacion: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('current_timestamp'),
    },

}, {
    timestamps: false, // Desactiva las marcas de tiempo automáticas (createdAt, updatedAt)

});

Account.sync().then(() => {
    console.log("Account Model synced");
}).catch((e) => { console.log(e) });
module.exports = Account;
