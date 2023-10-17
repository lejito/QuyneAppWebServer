const { DataTypes } = require('sequelize');
const sequelize = require('../../db');

const User = sequelize.define("Usuario",
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: "id"
		},

		tipoDocumento: {
			type: DataTypes.STRING(2),
			allowNull: false,
			validate: {
				isIn: [["CC", "TI", "CE", "PP"]]
			},
			field: "tipo_documento"
		},
		numeroDocumento: {
			type: DataTypes.STRING(10),
			allowNull: false,
			field: "numero_documento"
		},
		primerNombre: {
			type: DataTypes.STRING(20),
			allowNull: false,
			field: "primer_nombre"
		},
		segundoNombre: {
			type: DataTypes.STRING(20),
			allowNull: true,
			field: "segundo_nombre"
		},
		primerApellido: {
			type: DataTypes.STRING(20),
			allowNull: false,
			field: "primer_apellido"
		},
		segundoApellido: {
			type: DataTypes.STRING(20),
			allowNull: true,
			field: "segundo_apellido"
		},
		fehaNacimiento: {
			type: DataTypes.DATE,
			allowNull: false,
			field: "fechaNacimiento"
		},
		correoElectronico: {
			type: DataTypes.STRING(120),
			allowNull: false,
			unique: true,
			field: "correo_electronico"
		},
		clave: {
			type: DataTypes.STRING(76),
			allowNull: false,
			field: "clave"
		},
		fechaCreacion: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW,
			field: "fecha_creacion"
		}
	},
	{
		tableName: "usuarios",
		timestamps: false, // Desactiva las marcas de tiempo automáticas (createdAt, updatedAt)
		indexes: [
			{
				unique: true,
				fields: ["tipoDocumento", "numeroDocumento"]
			}
		]
	}
);

module.exports = User;