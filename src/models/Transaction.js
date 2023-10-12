"use strict"
const sequelize = require("../../config/db");
const Sequelize = require("sequelize")
const { DataTypes } = require("sequelize");

const Transactions = sequelize.sequelize.define('movimientos', {
    cuenta_origen: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    fecha_hora: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('current_timestamp'),
    },
    monto: {
        type: DataTypes.DECIMAL(16, 2),
        allowNull: false,
    },
}, {
    timestamps: false
});


Transactions.sync().then(() => {
    console.log("Transaction Model synced");
}).catch((e) => { console.log(e) });
module.exports = Transactions;