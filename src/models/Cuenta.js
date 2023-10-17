const { DataTypes } = require('sequelize');
const sequelize = require('../../db');
const Usuario = require('./Usuario');

const Cuenta = sequelize.define("Cuenta",
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: "id"
		},
		numeroTelefono: {
			type: DataTypes.STRING(10),
			allowNull: false,
      unique: true,
			field: "numero_telefono"
		},
		idUsuario: {
			type: DataTypes.INTEGER,
			allowNull: false,
			field: "id_usuario"
		},
		saldoDisponible: {
			type: DataTypes.DECIMAL(16,2),
			allowNull: false,
      defaultValue: 0,
			field: "saldo_disponible"
		},
		habilitada: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
      defaultValue: true,
			field: "habilitada"
		},
    saldoOculto: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
      defaultValue: false,
			field: "saldo_oculto"
		},
		fechaCreacion: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW,
			field: "fecha_creacion"
		}
	},
	{
		tableName: "cuentas",
		timestamps: false // Desactiva las marcas de tiempo automáticas (createdAt, updatedAt)
	}
);

Cuenta.belongsTo(Usuario, { foreignKey: "idUsuario" });

module.exports = Cuenta;