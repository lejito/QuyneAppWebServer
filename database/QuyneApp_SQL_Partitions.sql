--- QUYNEAPPDB - GOOGLE DRIVE: https://drive.google.com/drive/folders/1N4EG9pGkzNvGnHF8qf4QDJdi2HwiepJt?usp=drive_link


---
---	ESTRUCTURAS DE LAS TABLAS PARTICIONES
---



--
-- PARTICIONES DE LA TABLA USUARIOS
--
CREATE TABLE usuarios_2020
PARTITION OF usuarios
FOR VALUES FROM ('2020-01-01') TO ('2021-01-01')
PARTITION BY LIST (tipo_documento);

CREATE TABLE usuarios_2020_cc
PARTITION OF usuarios_2020
FOR VALUES IN ('CC');

ALTER TABLE usuarios_2020_cc
ADD CONSTRAINT usuarios_2020_cc_uq_id UNIQUE (id),
ADD CONSTRAINT usuarios_2020_cc_uq_documento UNIQUE (tipo_documento, numero_documento),
ADD CONSTRAINT usuarios_2020_cc_uq_correo_electronico UNIQUE (correo_electronico);

CREATE TABLE usuarios_2020_ti
PARTITION OF usuarios_2020
FOR VALUES IN ('TI');

ALTER TABLE usuarios_2020_ti
ADD CONSTRAINT usuarios_2020_ti_uq_id UNIQUE (id),
ADD CONSTRAINT usuarios_2020_ti_uq_documento UNIQUE (tipo_documento, numero_documento),
ADD CONSTRAINT usuarios_2020_ti_uq_correo_electronico UNIQUE (correo_electronico);

CREATE TABLE usuarios_2020_otro
PARTITION OF usuarios_2020
DEFAULT;

ALTER TABLE usuarios_2020_otro
ADD CONSTRAINT usuarios_2020_otro_uq_id UNIQUE (id),
ADD CONSTRAINT usuarios_2020_otro_uq_documento UNIQUE (tipo_documento, numero_documento),
ADD CONSTRAINT usuarios_2020_otro_uq_correo_electronico UNIQUE (correo_electronico);

CREATE TABLE usuarios_2021
PARTITION OF usuarios
FOR VALUES FROM ('2021-01-01') TO ('2022-01-01')
PARTITION BY LIST (tipo_documento);

CREATE TABLE usuarios_2021_cc
PARTITION OF usuarios_2021
FOR VALUES IN ('CC');

ALTER TABLE usuarios_2021_cc
ADD CONSTRAINT usuarios_2021_cc_uq_id UNIQUE (id),
ADD CONSTRAINT usuarios_2021_cc_uq_documento UNIQUE (tipo_documento, numero_documento),
ADD CONSTRAINT usuarios_2021_cc_uq_correo_electronico UNIQUE (correo_electronico);

CREATE TABLE usuarios_2021_ti
PARTITION OF usuarios_2021
FOR VALUES IN ('TI');

ALTER TABLE usuarios_2021_ti
ADD CONSTRAINT usuarios_2021_ti_uq_id UNIQUE (id),
ADD CONSTRAINT usuarios_2021_ti_uq_documento UNIQUE (tipo_documento, numero_documento),
ADD CONSTRAINT usuarios_2021_ti_uq_correo_electronico UNIQUE (correo_electronico);

CREATE TABLE usuarios_2021_otro
PARTITION OF usuarios_2021
DEFAULT;

ALTER TABLE usuarios_2021_otro
ADD CONSTRAINT usuarios_2021_otro_uq_id UNIQUE (id),
ADD CONSTRAINT usuarios_2021_otro_uq_documento UNIQUE (tipo_documento, numero_documento),
ADD CONSTRAINT usuarios_2021_otro_uq_correo_electronico UNIQUE (correo_electronico);

CREATE TABLE usuarios_2022
PARTITION OF usuarios
FOR VALUES FROM ('2022-01-01') TO ('2023-01-01')
PARTITION BY LIST (tipo_documento);

CREATE TABLE usuarios_2022_cc
PARTITION OF usuarios_2022
FOR VALUES IN ('CC');

ALTER TABLE usuarios_2022_cc
ADD CONSTRAINT usuarios_2022_cc_uq_id UNIQUE (id),
ADD CONSTRAINT usuarios_2022_cc_uq_documento UNIQUE (tipo_documento, numero_documento),
ADD CONSTRAINT usuarios_2022_cc_uq_correo_electronico UNIQUE (correo_electronico);

CREATE TABLE usuarios_2022_ti
PARTITION OF usuarios_2022
FOR VALUES IN ('TI');

ALTER TABLE usuarios_2022_ti
ADD CONSTRAINT usuarios_2022_ti_uq_id UNIQUE (id),
ADD CONSTRAINT usuarios_2022_ti_uq_documento UNIQUE (tipo_documento, numero_documento),
ADD CONSTRAINT usuarios_2022_ti_uq_correo_electronico UNIQUE (correo_electronico);

CREATE TABLE usuarios_2022_otro
PARTITION OF usuarios_2022
DEFAULT;

ALTER TABLE usuarios_2022_otro
ADD CONSTRAINT usuarios_2022_otro_uq_id UNIQUE (id),
ADD CONSTRAINT usuarios_2022_otro_uq_documento UNIQUE (tipo_documento, numero_documento),
ADD CONSTRAINT usuarios_2022_otro_uq_correo_electronico UNIQUE (correo_electronico);

CREATE TABLE usuarios_2023
PARTITION OF usuarios
FOR VALUES FROM ('2023-01-01') TO ('2024-01-01')
PARTITION BY LIST (tipo_documento);

CREATE TABLE usuarios_2023_cc
PARTITION OF usuarios_2023
FOR VALUES IN ('CC');

ALTER TABLE usuarios_2023_cc
ADD CONSTRAINT usuarios_2023_cc_uq_id UNIQUE (id),
ADD CONSTRAINT usuarios_2023_cc_uq_documento UNIQUE (tipo_documento, numero_documento),
ADD CONSTRAINT usuarios_2023_cc_uq_correo_electronico UNIQUE (correo_electronico);

CREATE TABLE usuarios_2023_ti
PARTITION OF usuarios_2023
FOR VALUES IN ('TI');

ALTER TABLE usuarios_2023_ti
ADD CONSTRAINT usuarios_2023_ti_uq_id UNIQUE (id),
ADD CONSTRAINT usuarios_2023_ti_uq_documento UNIQUE (tipo_documento, numero_documento),
ADD CONSTRAINT usuarios_2023_ti_uq_correo_electronico UNIQUE (correo_electronico);

CREATE TABLE usuarios_2023_otro
PARTITION OF usuarios_2023
DEFAULT;

ALTER TABLE usuarios_2023_otro
ADD CONSTRAINT usuarios_2023_otro_uq_id UNIQUE (id),
ADD CONSTRAINT usuarios_2023_otro_uq_documento UNIQUE (tipo_documento, numero_documento),
ADD CONSTRAINT usuarios_2023_otro_uq_correo_electronico UNIQUE (correo_electronico);


--
-- PARTICIONES DE LA TABLA CUENTAS
--
CREATE TABLE cuentas_2020
PARTITION OF cuentas
FOR VALUES FROM ('2020-01-01') TO ('2021-01-01');

ALTER TABLE cuentas_2020
ADD CONSTRAINT cuentas_2020_uq_id UNIQUE (id),
ADD CONSTRAINT cuentas_2020_uq_numero_telefono UNIQUE (numero_telefono);

CREATE TABLE cuentas_2021
PARTITION OF cuentas
FOR VALUES FROM ('2021-01-01') TO ('2022-01-01');

ALTER TABLE cuentas_2021
ADD CONSTRAINT cuentas_2021_uq_id UNIQUE (id),
ADD CONSTRAINT cuentas_2021_uq_numero_telefono UNIQUE (numero_telefono);

CREATE TABLE cuentas_2022
PARTITION OF cuentas
FOR VALUES FROM ('2022-01-01') TO ('2023-01-01');

ALTER TABLE cuentas_2022
ADD CONSTRAINT cuentas_2022_uq_id UNIQUE (id),
ADD CONSTRAINT cuentas_2022_uq_numero_telefono UNIQUE (numero_telefono);

CREATE TABLE cuentas_2023
PARTITION OF cuentas
FOR VALUES FROM ('2023-01-01') TO ('2024-01-01');

ALTER TABLE cuentas_2023
ADD CONSTRAINT cuentas_2023_uq_id UNIQUE (id),
ADD CONSTRAINT cuentas_2023_uq_numero_telefono UNIQUE (numero_telefono);


--
-- PARTICIONES DE LA TABLA MOVIMIENTOS
--
CREATE TABLE movimientos_20201
PARTITION OF movimientos
FOR VALUES FROM ('2020-01-01') TO ('2020-07-01');

ALTER TABLE movimientos_20201
ADD CONSTRAINT movimientos_20201_uq_id UNIQUE (id);

CREATE TABLE movimientos_20202
PARTITION OF movimientos
FOR VALUES FROM ('2020-07-01') TO ('2021-01-01');

ALTER TABLE movimientos_20202
ADD CONSTRAINT movimientos_20202_uq_id UNIQUE (id);

CREATE TABLE movimientos_20211
PARTITION OF movimientos
FOR VALUES FROM ('2021-01-01') TO ('2021-07-01');

ALTER TABLE movimientos_20211
ADD CONSTRAINT movimientos_20211_uq_id UNIQUE (id);

CREATE TABLE movimientos_20212
PARTITION OF movimientos
FOR VALUES FROM ('2021-07-01') TO ('2022-01-01');

ALTER TABLE movimientos_20212
ADD CONSTRAINT movimientos_20212_uq_id UNIQUE (id);

CREATE TABLE movimientos_20221
PARTITION OF movimientos
FOR VALUES FROM ('2022-01-01') TO ('2022-07-01');

ALTER TABLE movimientos_20221
ADD CONSTRAINT movimientos_20221_uq_id UNIQUE (id);

CREATE TABLE movimientos_20222
PARTITION OF movimientos
FOR VALUES FROM ('2022-07-01') TO ('2023-01-01');

ALTER TABLE movimientos_20222
ADD CONSTRAINT movimientos_20222_uq_id UNIQUE (id);

CREATE TABLE movimientos_20231
PARTITION OF movimientos
FOR VALUES FROM ('2023-01-01') TO ('2023-07-01');

ALTER TABLE movimientos_20231
ADD CONSTRAINT movimientos_20231_uq_id UNIQUE (id);

CREATE TABLE movimientos_20232
PARTITION OF movimientos
FOR VALUES FROM ('2023-07-01') TO ('2024-01-01');

ALTER TABLE movimientos_20232
ADD CONSTRAINT movimientos_20232_uq_id UNIQUE (id);


--
-- PARTICIONES DE LA TABLA TRANSFERENCIAS EXTERNAS
--
CREATE TABLE transferencias_externas_bancolombia
PARTITION OF transferencias_externas
FOR VALUES IN ('Bancolombia');

ALTER TABLE transferencias_externas_bancolombia
ADD CONSTRAINT transferencias_externas_bancolombia_uq_id UNIQUE (id);

CREATE TABLE transferencias_externas_bancodebogota
PARTITION OF transferencias_externas
FOR VALUES IN ('BancoDeBogota');

ALTER TABLE transferencias_externas_bancodebogota
ADD CONSTRAINT transferencias_externas_bancodebogota_uq_id UNIQUE (id);

CREATE TABLE transferencias_externas_bancodeoccidente
PARTITION OF transferencias_externas
FOR VALUES IN ('BancoDeOccidente');

ALTER TABLE transferencias_externas_bancodeoccidente
ADD CONSTRAINT transferencias_externas_bancodeoccidente_uq_id UNIQUE (id);

CREATE TABLE transferencias_externas_bancopopular
PARTITION OF transferencias_externas
FOR VALUES IN ('BancoPopular');

ALTER TABLE transferencias_externas_bancopopular
ADD CONSTRAINT transferencias_externas_bancopopular_uq_id UNIQUE (id);

CREATE TABLE transferencias_externas_avvillas
PARTITION OF transferencias_externas
FOR VALUES IN ('AVVillas');

ALTER TABLE transferencias_externas_avvillas
ADD CONSTRAINT transferencias_externas_avvillas_uq_id UNIQUE (id);

CREATE TABLE transferencias_externas_bbvacolombia
PARTITION OF transferencias_externas
FOR VALUES IN ('BBVAColombia');

ALTER TABLE transferencias_externas_bbvacolombia
ADD CONSTRAINT transferencias_externas_bbvacolombia_uq_id UNIQUE (id);

CREATE TABLE transferencias_externas_davivienda
PARTITION OF transferencias_externas
FOR VALUES IN ('Davivienda');

ALTER TABLE transferencias_externas_davivienda
ADD CONSTRAINT transferencias_externas_davivienda_uq_id UNIQUE (id);

CREATE TABLE transferencias_externas_otro
PARTITION OF transferencias_externas
DEFAULT;

ALTER TABLE transferencias_externas_otro
ADD CONSTRAINT transferencias_externas_otro_uq_id UNIQUE (id);


--
-- PARTICIONES DE LA TABLA RECARGAS TELEFONIA
--
CREATE TABLE recargas_telefonia_claro
PARTITION OF recargas_telefonia
FOR VALUES IN ('Claro');

ALTER TABLE recargas_telefonia_claro
ADD CONSTRAINT recargas_telefonia_claro_uq_id UNIQUE (id);

CREATE TABLE recargas_telefonia_tigo
PARTITION OF recargas_telefonia
FOR VALUES IN ('Tigo');

ALTER TABLE recargas_telefonia_tigo
ADD CONSTRAINT recargas_telefonia_tigo_uq_id UNIQUE (id);

CREATE TABLE recargas_telefonia_movistar
PARTITION OF recargas_telefonia
FOR VALUES IN ('Movistar');

ALTER TABLE recargas_telefonia_movistar
ADD CONSTRAINT recargas_telefonia_movistar_uq_id UNIQUE (id);

CREATE TABLE recargas_telefonia_wom
PARTITION OF recargas_telefonia
FOR VALUES IN ('WOM');

ALTER TABLE recargas_telefonia_wom
ADD CONSTRAINT recargas_telefonia_wom_uq_id UNIQUE (id);

CREATE TABLE recargas_telefonia_virgin
PARTITION OF recargas_telefonia
FOR VALUES IN ('Virgin');

ALTER TABLE recargas_telefonia_virgin
ADD CONSTRAINT recargas_telefonia_virgin_uq_id UNIQUE (id);

CREATE TABLE recargas_telefonia_otro
PARTITION OF recargas_telefonia
DEFAULT;

ALTER TABLE recargas_telefonia_otro
ADD CONSTRAINT recargas_telefonia_otro_uq_id UNIQUE (id);


--
-- PARTICIONES DE LA TABLA PAQUETES TELEFONIA
--
CREATE TABLE paquetes_telefonia_claro
PARTITION OF paquetes_telefonia
FOR VALUES IN ('Claro');

ALTER TABLE paquetes_telefonia_claro
ADD CONSTRAINT paquetes_telefonia_claro_uq_id UNIQUE (id);

CREATE TABLE paquetes_telefonia_tigo
PARTITION OF paquetes_telefonia
FOR VALUES IN ('Tigo');

ALTER TABLE paquetes_telefonia_tigo
ADD CONSTRAINT paquetes_telefonia_tigo_uq_id UNIQUE (id);

CREATE TABLE paquetes_telefonia_movistar
PARTITION OF paquetes_telefonia
FOR VALUES IN ('Movistar');

ALTER TABLE paquetes_telefonia_movistar
ADD CONSTRAINT paquetes_telefonia_movistar_uq_id UNIQUE (id);

CREATE TABLE paquetes_telefonia_wom
PARTITION OF paquetes_telefonia
FOR VALUES IN ('WOM');

ALTER TABLE paquetes_telefonia_wom
ADD CONSTRAINT paquetes_telefonia_wom_uq_id UNIQUE (id);

CREATE TABLE paquetes_telefonia_virgin
PARTITION OF paquetes_telefonia
FOR VALUES IN ('Virgin');

ALTER TABLE paquetes_telefonia_virgin
ADD CONSTRAINT paquetes_telefonia_virgin_uq_id UNIQUE (id);

CREATE TABLE paquetes_telefonia_otro
PARTITION OF paquetes_telefonia
DEFAULT;

ALTER TABLE paquetes_telefonia_otro
ADD CONSTRAINT paquetes_telefonia_otro_uq_id UNIQUE (id);