const sequelize = require("../../config/db");
const Sequelize = require("sequelize")
const { DataTypes } = require("sequelize");
const User = sequelize.sequelize.define('usuarios', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },

    tipo_documento: {
        type: DataTypes.STRING(2),
        allowNull: false,
    },
    numero_documento: {
        type: DataTypes.STRING(10),
        allowNull: false,
    },
    primer_nombre: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    segundo_nombre: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    primer_apellido: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    segundo_apellido: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    fecha_nacimiento: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    correo_electronico: {
        type: DataTypes.STRING(120),
        allowNull: false,
    },
    clave: {
        type: DataTypes.STRING(76),
        allowNull: false,
    },
    fecha_creacion: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('current_timestamp'),
    },

}, {

    timestamps: false, // Desactiva las marcas de tiempo automáticas (createdAt, updatedAt)

},
);

User.sync().then(() => {
    console.log("User Model synced");
}).catch((e) => { console.log(e) });
module.exports = User;