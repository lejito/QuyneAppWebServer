--- QUYNEAPPDB - GOOGLE DRIVE: https://drive.google.com/drive/folders/1N4EG9pGkzNvGnHF8qf4QDJdi2HwiepJt?usp=drive_link


---
---	ESTRUCTURAS DE LAS TABLAS
---
CREATE TABLE usuarios(
	id SERIAL NOT NULL,
	tipo_documento VARCHAR(2) NOT NULL,
	numero_documento VARCHAR(10) NOT NULL,
	primer_nombre VARCHAR(20) NOT NULL,
	segundo_nombre VARCHAR(20) NULL,
	primer_apellido VARCHAR(20) NOT NULL,
	segundo_apellido VARCHAR(20) NULL,
	fecha_nacimiento DATE NOT NULL,
	correo_electronico VARCHAR(120) NOT NULL,
	clave VARCHAR(76) NOT NULL,
	fecha_creacion DATE NOT NULL DEFAULT CURRENT_DATE,
	CONSTRAINT usuarios_pk PRIMARY KEY (id),
	CONSTRAINT usuarios_uq_documento UNIQUE (tipo_documento, numero_documento),
	CONSTRAINT usuarios_uq_correo_electronico UNIQUE (correo_electronico),
	CONSTRAINT usuarios_ck_tipo_documento CHECK (tipo_documento IN ('CC', 'TI', 'CE', 'PP'))
);

CREATE TABLE cuentas(
	id SERIAL NOT NULL,
	numero_telefono VARCHAR(10) NOT NULL,
	id_usuario INT NOT NULL,
	saldo_disponible DECIMAL(16,2) NOT NULL DEFAULT 0,
	habilitada BOOLEAN NOT NULL DEFAULT TRUE,
	saldo_oculto BOOLEAN NOT NULL DEFAULT FALSE,
	fecha_creacion DATE NOT NULL DEFAULT CURRENT_DATE,
	CONSTRAINT cuentas_pk PRIMARY KEY (id),
	CONSTRAINT cuentas_uq_numero_telefono UNIQUE (numero_telefono)
);

CREATE TABLE movimientos(
	id SERIAL NOT NULL,
	cuenta_origen INT NOT NULL,
	monto DECIMAL(16,2) NOT NULL,
	fecha_hora TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	fecha DATE NOT NULL DEFAULT CURRENT_DATE,
	CONSTRAINT movimiento_pk PRIMARY KEY (id)
);

CREATE TABLE transferencias_internas(
	id SERIAL NOT NULL,
	id_movimiento INT NOT NULL,
	cuenta_destino INT NOT NULL,
	CONSTRAINT transferencias_internas_pk PRIMARY KEY (id)
);

CREATE TABLE transferencias_externas(
	id SERIAL NOT NULL,
	id_movimiento INT NOT NULL,
	entidad_destino VARCHAR(20) NOT NULL,
	cuenta_destino VARCHAR(15) NOT NULL,
	CONSTRAINT transferencias_externas_pk PRIMARY KEY (id)
);

CREATE TABLE facturas(
	id SERIAL NOT NULL,
	id_movimiento INT NOT NULL,
	descripcion VARCHAR(50) NOT NULL,
	referencia VARCHAR(30) NOT NULL,
	CONSTRAINT facturas_pk PRIMARY KEY (id) 
);

CREATE TABLE recargas_civica(
	id SERIAL NOT NULL,
	id_movimiento INT NOT NULL,
	tipo_documento VARCHAR(2) NOT NULL,
	numero_documento VARCHAR(10) NOT NULL,
	CONSTRAINT recargas_civica_pk PRIMARY KEY (id),
	CONSTRAINT recargas_civica_ck_tipo_documento CHECK (tipo_documento IN ('CC', 'TI', 'CE', 'PP'))
);

CREATE TABLE recargas_telefonia(
	id SERIAL NOT NULL,
	id_movimiento INT NOT NULL,
	operador VARCHAR(20) NOT NULL,
	numero VARCHAR(10) NOT NULL,
	CONSTRAINT recargas_telefonia_pk PRIMARY KEY (id)
);

CREATE TABLE paquetes_telefonia(
	id SERIAL NOT NULL,
	id_movimiento INT NOT NULL,
	operador VARCHAR(20) NOT NULL,
	nombre VARCHAR(30) NOT NULL,
	numero VARCHAR(10) NOT NULL,
	CONSTRAINT paquetes_telefonia_pk PRIMARY KEY (id)
);

CREATE TABLE recargas(
	id SERIAL NOT NULL,
	id_movimiento INT NOT NULL,
	corresponsal VARCHAR(30) NOT NULL,
	CONSTRAINT recargas_pk PRIMARY KEY (id)
);

CREATE TABLE retiros(
	id SERIAL NOT NULL,
	id_movimiento INT NOT NULL,
	corresponsal VARCHAR(30) NOT NULL,
	CONSTRAINT retiros_pk PRIMARY KEY (id)
);

CREATE TABLE bolsillos(
	id SERIAL NOT NULL,
	id_cuenta INT NOT NULL,
	nombre VARCHAR(20) NOT NULL,
	saldo_disponible DECIMAL(16,2) NOT NULL DEFAULT 0,
	saldo_objetivo DECIMAL(16,2) NULL DEFAULT NULL,
	eliminado BOOLEAN DEFAULT FALSE,
	CONSTRAINT bolsillos_pk PRIMARY KEY (id)
);

CREATE TABLE transferencias_bolsillos(
	id SERIAL NOT NULL,
	id_movimiento INT NOT NULL,
	id_bolsillo INT NOT NULL,
	tipo VARCHAR(10) NOT NULL,
	CONSTRAINT transferencias_bolsillos_pk PRIMARY KEY (id),
	CONSTRAINT transferencias_bolsillos_ck_tipo CHECK (tipo IN ('Carga', 'Descarga'))
);

CREATE TABLE registros(
	id SERIAL NOT NULL,
	id_usuario INT NOT NULL,
	accion VARCHAR(50) NOT NULL,
	fecha_hora TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	fecha DATE NOT NULL DEFAULT CURRENT_DATE,
	CONSTRAINT registros_pk PRIMARY KEY (id)
);

CREATE TABLE codigos_verificacion(
	id SERIAL NOT NULL,
	id_usuario INT NOT NULL,
	codigo VARCHAR(4) NOT NULL,
	fecha_hora_generacion TIMESTAMP NOT NULL,
	fecha_hora_vencimiento TIMESTAMP NOT NULL,
	CONSTRAINT codigos_verificacion_pk PRIMARY KEY (id)
);


---
--- RELACIONES ENTRE LAS TABLAS
---
ALTER TABLE cuentas
	ADD CONSTRAINT cuentas_fk_id_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON UPDATE RESTRICT ON DELETE RESTRICT
;

ALTER TABLE movimientos
	ADD CONSTRAINT movimientos_fk_cuenta_origen FOREIGN KEY (cuenta_origen) REFERENCES cuentas(id) ON UPDATE RESTRICT ON DELETE RESTRICT
;

ALTER TABLE transferencias_internas
	ADD CONSTRAINT transferencias_internas_fk_id_movimiento FOREIGN KEY (id_movimiento) REFERENCES movimientos(id) ON UPDATE RESTRICT ON DELETE RESTRICT,
	ADD CONSTRAINT transferencias_internas_fk_cuenta_destino FOREIGN KEY (cuenta_destino) REFERENCES cuentas(id) ON UPDATE RESTRICT ON DELETE RESTRICT
;

ALTER TABLE transferencias_externas
	ADD CONSTRAINT transferencias_externas_fk_id_movimiento FOREIGN KEY (id_movimiento) REFERENCES movimientos(id) ON UPDATE RESTRICT ON DELETE RESTRICT
;

ALTER TABLE facturas
	ADD CONSTRAINT facturas_fk_id_movimiento FOREIGN KEY (id_movimiento) REFERENCES movimientos(id) ON UPDATE RESTRICT ON DELETE RESTRICT
;

ALTER TABLE recargas_civica
	ADD CONSTRAINT recargas_civica_fk_id_movimiento FOREIGN KEY (id_movimiento) REFERENCES movimientos(id) ON UPDATE RESTRICT ON DELETE RESTRICT
;

ALTER TABLE recargas_telefonia
	ADD CONSTRAINT recargas_telefonia_fk_id_movimiento FOREIGN KEY (id_movimiento) REFERENCES movimientos(id) ON UPDATE RESTRICT ON DELETE RESTRICT
;

ALTER TABLE paquetes_telefonia
	ADD CONSTRAINT paquetes_telefonia_fk_id_movimiento FOREIGN KEY (id_movimiento) REFERENCES movimientos(id) ON UPDATE RESTRICT ON DELETE RESTRICT
;

ALTER TABLE recargas
	ADD CONSTRAINT recargas_fk_id_movimiento FOREIGN KEY (id_movimiento) REFERENCES movimientos(id) ON UPDATE RESTRICT ON DELETE RESTRICT
;

ALTER TABLE retiros
	ADD CONSTRAINT retiros_fk_id_movimiento FOREIGN KEY (id_movimiento) REFERENCES movimientos(id) ON UPDATE RESTRICT ON DELETE RESTRICT
;

ALTER TABLE bolsillos
	ADD CONSTRAINT bolsillos_fk_id_cuenta FOREIGN KEY (id_cuenta) REFERENCES cuentas(id) ON UPDATE RESTRICT ON DELETE RESTRICT
;

ALTER TABLE transferencias_bolsillos
	ADD CONSTRAINT transferencias_bolsillos_fk_id_movimiento FOREIGN KEY (id_movimiento) REFERENCES movimientos(id) ON UPDATE RESTRICT ON DELETE RESTRICT,
	ADD CONSTRAINT transferencias_bolsillos_fk_id_bolsillo FOREIGN KEY (id_bolsillo) REFERENCES bolsillos(id) ON UPDATE RESTRICT ON DELETE RESTRICT
;

ALTER TABLE registros
	ADD CONSTRAINT registros_fk_id_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON UPDATE RESTRICT ON DELETE RESTRICT
;

ALTER TABLE codigos_verificacion
	ADD CONSTRAINT codigos_verificacion_fk_id_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON UPDATE RESTRICT ON DELETE RESTRICT
;