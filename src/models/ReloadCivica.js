"use strict"
const sequelize = require("../../config/db");
const Sequelize = require("sequelize")
const { DataTypes } = require("sequelize");


const ReloadCivica = sequelize.sequelize.define('recargas_civica', {
    id_movimiento: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    tipo_documento: {
        type: DataTypes.STRING(2),
        allowNull: false,
        validate: {
            isIn: [['CC', 'TI', 'CE', 'PP']],
        },
    },
    numero_documento: {
        type: DataTypes.STRING(10),
        allowNull: false,
    },
}, {

    timestamps: false, // Desactiva las marcas de tiempo automáticas (createdAt, updatedAt)
});

ReloadCivica.sync().then(() => {
    console.log("ReloadCivica Model synced");
}).catch((e) => { console.log(e) });
module.exports = ReloadCivica;
