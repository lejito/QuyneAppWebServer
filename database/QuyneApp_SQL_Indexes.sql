--- QUYNEAPPDB - GOOGLE DRIVE: https://drive.google.com/drive/folders/1N4EG9pGkzNvGnHF8qf4QDJdi2HwiepJt?usp=drive_link


--
-- ÍNDICES
--
CREATE INDEX idx_cuentas_numero_telefono ON cuentas USING HASH (numero_telefono);

CREATE INDEX idx_movimientos_cuenta_origen ON movimientos (cuenta_origen);

CREATE INDEX idx_transferencias_internas_id_movimiento ON transferencias_internas (id_movimiento);

CREATE INDEX idx_transferencias_externas_id_movimiento ON transferencias_externas (id_movimiento);

CREATE INDEX idx_facturas_id_movimiento ON facturas (id_movimiento);

CREATE INDEX idx_recargas_civica_id_movimiento ON recargas_civica (id_movimiento);

CREATE INDEX idx_recargas_telefonia_id_movimiento ON recargas_telefonia (id_movimiento);

CREATE INDEX idx_paquetes_telefonia_id_movimiento ON paquetes_telefonia (id_movimiento);

CREATE INDEX idx_recargas_id_movimiento ON recargas (id_movimiento);

CREATE INDEX idx_retiros_id_movimiento ON retiros (id_movimiento);

CREATE INDEX idx_transferencias_bolsillos_id_movimiento ON transferencias_bolsillos (id_movimiento);

CREATE INDEX idx_usuarios_correo_electronico ON usuarios USING HASH (correo_electronico);

CREATE INDEX idx_registros_id_usuario ON registros (id_usuario);

CREATE INDEX idx_codigos_verificacion_id_usuario ON codigos_verificacion (id_usuario);

CREATE INDEX idx_bolsillos_id_cuenta ON bolsillos (id_cuenta);