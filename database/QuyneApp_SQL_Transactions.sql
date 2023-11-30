--- QUYNEAPPDB - GOOGLE DRIVE: https://drive.google.com/drive/folders/1N4EG9pGkzNvGnHF8qf4QDJdi2HwiepJt?usp=drive_link


--
-- TRANSACCIÓN: REGISTRAR USUARIO Y CUENTA
--
CREATE OR REPLACE FUNCTION registrar_usuario_cuenta(tipo_documento VARCHAR(2), numero_documento VARCHAR(10), primer_nombre VARCHAR(20), segundo_nombre VARCHAR(20), primer_apellido VARCHAR(20), segundo_apellido VARCHAR(20), fecha_nacimiento DATE, correo_electronico VARCHAR(120), clave VARCHAR(76), numero_telefono VARCHAR(10))
RETURNS BOOLEAN AS $$
DECLARE
  usuario_registrado_documento BOOLEAN;
  usuario_registrado_correo BOOLEAN;
  cuenta_registrada_numero BOOLEAN;
  id_usuario INT;
BEGIN
  SELECT verificar_existencia_usuario_documento(tipo_documento, numero_documento) INTO usuario_registrado_documento;
  SELECT verificar_existencia_usuario_correo(correo_electronico) INTO usuario_registrado_correo;
  SELECT verificar_existencia_cuenta_numero(numero_telefono) INTO cuenta_registrada_numero;
  
  IF (NOT usuario_registrado_documento) AND (NOT usuario_registrado_correo) AND (NOT cuenta_registrada_numero) THEN 
    INSERT INTO usuarios (tipo_documento, numero_documento, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, fecha_nacimiento, correo_electronico, clave)
    VALUES (tipo_documento, numero_documento, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, fecha_nacimiento, correo_electronico, clave)
    RETURNING id INTO id_usuario;
    
    INSERT INTO cuentas (numero_telefono, id_usuario)	
    VALUES (numero_telefono, id_usuario);
    RETURN TRUE;
  ELSE
    RETURN FALSE;
  END IF;
END;
$$ LANGUAGE plpgsql;


-- 
-- TRANSACCIÓN: CONSULTAR CLAVE DE USUARIO
--
CREATE OR REPLACE FUNCTION consultar_clave(tipo_documento VARCHAR(2), numero_documento VARCHAR(10))
RETURNS VARCHAR(76) AS $$
DECLARE
  clave VARCHAR(76);
BEGIN
  SELECT usuarios.clave 
  FROM usuarios 
  WHERE usuarios.tipo_documento = consultar_clave.tipo_documento AND usuarios.numero_documento = consultar_clave.numero_documento
  INTO clave;
  
  RETURN clave;
END
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION consultar_clave(id_usuario INT)
RETURNS VARCHAR(76) AS $$
DECLARE
  clave VARCHAR(76);
BEGIN
  SELECT usuarios.clave 
  FROM usuarios 
  WHERE usuarios.id = id_usuario
  INTO clave;
  
  RETURN clave;
END
$$ LANGUAGE plpgsql;


--
-- TRANSACCIÓN: CONSULTAR DATOS DE USUARIO
--
CREATE OR REPLACE FUNCTION consultar_usuario(id_usuario INT)
RETURNS TABLE(
  id INT,
  tipo_documento VARCHAR(2),
  numero_documento VARCHAR(10),
  primer_nombre VARCHAR(20),
  segundo_nombre VARCHAR(20),
  primer_apellido VARCHAR(20),
  segundo_apellido VARCHAR(20),
  fecha_nacimiento DATE,
  correo_electronico VARCHAR(120)
) AS $$
BEGIN
  RETURN QUERY (
    SELECT u.id, u.tipo_documento, u.numero_documento, u.primer_nombre, u.segundo_nombre, u.primer_apellido, u.segundo_apellido, u.fecha_nacimiento, u.correo_electronico
    FROM usuarios u
    WHERE u.id = consultar_usuario.id_usuario
  );
END
$$ LANGUAGE plpgsql;


--
-- TRANSACCIÓN: CONSULTAR CODIGO USUARIO
--
CREATE OR REPLACE FUNCTION consultar_codigo_usuario(tipo_documento VARCHAR(2), numero_documento VARCHAR(10))
RETURNS INT AS $$
DECLARE
  id_usuario INT;
BEGIN
  SELECT u.id 
  FROM usuarios u
  WHERE u.tipo_documento = consultar_codigo_usuario.tipo_documento AND u.numero_documento = consultar_codigo_usuario.numero_documento
  INTO id_usuario;
  
  IF id_usuario IS NOT NULL THEN
    RETURN id_usuario;
  ELSE
    RETURN -1;
  END IF;
END
$$ LANGUAGE plpgsql;


--
-- TRANSACCIÓN: CONSULTAR DATOS DE CUENTA
--
CREATE OR REPLACE FUNCTION consultar_cuenta(id_cuenta INT)
RETURNS TABLE(
  id INT,
  numero_telefono VARCHAR(10),
  id_usuario INT,
  habilitada BOOLEAN,
  saldo_oculto BOOLEAN
) AS $$
BEGIN
  RETURN QUERY (
    SELECT c.id, c.numero_telefono, c.id_usuario, c.habilitada, c.saldo_oculto
    FROM cuentas c
    WHERE c.id = consultar_cuenta.id_cuenta
  );
END
$$ LANGUAGE plpgsql;


--
-- TRANSACCIÓN: CONSULTAR CÓDIGO DE CUENTA CON NÚMERO DE TELÉFONO
--
CREATE OR REPLACE FUNCTION consultar_codigo_cuenta_numero_telefono(numero_telefono VARCHAR(10))
RETURNS INT AS $$
DECLARE
  id_cuenta INT;
BEGIN
  SELECT c.id 
  FROM cuentas c
  WHERE c.numero_telefono = consultar_codigo_cuenta_numero_telefono.numero_telefono
  INTO id_cuenta;
  
  IF id_cuenta IS NOT NULL THEN
    RETURN id_cuenta;
  ELSE
    RETURN -1;
  END IF;
END
$$ LANGUAGE plpgsql;


--
-- TRANSACCIÓN: CONSULTAR CÓDIGO DE CUENTA CON ID DE USUARIO
--
CREATE OR REPLACE FUNCTION consultar_codigo_cuenta_id_usuario(id_usuario INT)
RETURNS INT AS $$
DECLARE
  id_cuenta INT;
BEGIN
  SELECT c.id 
  FROM cuentas c
  WHERE c.id_usuario = consultar_codigo_cuenta_id_usuario.id_usuario
  INTO id_cuenta;
  
  IF id_cuenta IS NOT NULL THEN
    RETURN id_cuenta;
  ELSE
    RETURN -1;
  END IF;
END
$$ LANGUAGE plpgsql;


--
-- TRANSACCIÓN: VERIFICAR EXISTENCIA DE USUARIO CON TIPO Y NÚMERO DE DOCUMENTO
--
CREATE OR REPLACE FUNCTION verificar_existencia_usuario_documento(tipo_documento VARCHAR(2), numero_documento VARCHAR(10))
RETURNS BOOLEAN AS $$
DECLARE
  usuario_registrado BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT * 
    FROM usuarios 
    WHERE usuarios.tipo_documento = verificar_existencia_usuario_documento.tipo_documento AND usuarios.numero_documento = verificar_existencia_usuario_documento.numero_documento
  ) INTO usuario_registrado;

  RETURN usuario_registrado;
END
$$ LANGUAGE plpgsql;


--
-- TRANSACCIÓN: VERIFICAR EXISTENCIA DE USUARIO CON CORREO ELECTRÓNICO
--
CREATE OR REPLACE FUNCTION verificar_existencia_usuario_correo(correo_electronico VARCHAR(120))
RETURNS BOOLEAN AS $$
DECLARE
  usuario_registrado BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT * 
    FROM usuarios 
    WHERE usuarios.correo_electronico = verificar_existencia_usuario_correo.correo_electronico
  ) INTO usuario_registrado;

  RETURN usuario_registrado;
END
$$ LANGUAGE plpgsql;


--
-- TRANSACCIÓN: VERIFICAR EXISTENCIA DE CUENTA CON NÚMERO DE TELÉFONO
--
CREATE OR REPLACE FUNCTION verificar_existencia_cuenta_numero(numero_telefono VARCHAR(10))
RETURNS BOOLEAN AS $$
DECLARE
  cuenta_registrada BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT * 
    FROM cuentas 
    WHERE cuentas.numero_telefono = verificar_existencia_cuenta_numero.numero_telefono
  ) INTO cuenta_registrada;

  RETURN cuenta_registrada;
END
$$ LANGUAGE plpgsql;


--
-- TRANSACCIÓN: CREAR REGISTRO DE ACTIVIDAD
--
CREATE OR REPLACE FUNCTION crear_registro_actividad(id_usuario INT, accion VARCHAR(50))
RETURNS BOOLEAN AS $$
BEGIN
  INSERT INTO registros (id_usuario, accion)
  VALUES (id_usuario, accion);

  RETURN TRUE;
END
$$ LANGUAGE plpgsql;


--
-- TRANSACCIÓN: ACTUALIZAR DOCUMENTO DE IDENTIDAD
--
CREATE OR REPLACE FUNCTION actualizar_documento_identidad(id_usuario INT, nuevo_tipo_documento VARCHAR(2), nuevo_numero_documento VARCHAR(10))
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE usuarios
  SET tipo_documento = nuevo_tipo_documento, numero_documento = nuevo_numero_documento
  WHERE id = id_usuario;

  PERFORM crear_registro_actividad(id_usuario, 'Actualizar documento de identidad');

  RETURN TRUE;
END
$$ LANGUAGE plpgsql;


--
-- TRANSACCIÓN: ACTUALIZAR NOMBRE COMPLETO
--
CREATE OR REPLACE FUNCTION actualizar_nombre_completo(id_usuario INT, nuevo_primer_nombre VARCHAR(20), nuevo_segundo_nombre VARCHAR(20), nuevo_primer_apellido VARCHAR(20), nuevo_segundo_apellido VARCHAR(20))
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE usuarios
  SET primer_nombre = nuevo_primer_nombre, segundo_nombre = nuevo_segundo_nombre, primer_apellido = nuevo_primer_apellido, segundo_apellido = nuevo_segundo_apellido
  WHERE id = id_usuario;

  PERFORM crear_registro_actividad(id_usuario, 'Actualizar nombre completo');

  RETURN TRUE;
END
$$ LANGUAGE plpgsql;


--
-- TRANSACCIÓN: ACTUALIZAR CORREO ELECTRÓNICO
--
CREATE OR REPLACE FUNCTION actualizar_correo_electronico(id_usuario INT, nuevo_correo_electronico VARCHAR(120))
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE usuarios
  SET correo_electronico = nuevo_correo_electronico
  WHERE id = id_usuario;

  PERFORM crear_registro_actividad(id_usuario, 'Actualizar correo electrónico');

  RETURN TRUE;
END
$$ LANGUAGE plpgsql;


--
-- TRANSACCIÓN: ACTUALIZAR FECHA DE NACIMIENTO
--
CREATE OR REPLACE FUNCTION actualizar_fecha_nacimiento(id_usuario INT, nueva_fecha_nacimiento DATE)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE usuarios
  SET fecha_nacimiento = nueva_fecha_nacimiento
  WHERE id = id_usuario;

  PERFORM crear_registro_actividad(id_usuario, 'Actualizar fecha de nacimiento');

  RETURN TRUE;
END
$$ LANGUAGE plpgsql;


--
-- TRANSACCIÓN: ACTUALIZAR CONTRASEÑA
--
CREATE OR REPLACE FUNCTION actualizar_clave(id_usuario INT, nueva_clave VARCHAR(76))
RETURNS BOOLEAN AS $$
DECLARE
  id_usuario_v INT;
BEGIN
  UPDATE usuarios
  SET clave = nueva_clave
  WHERE id = id_usuario
  RETURNING id
  INTO id_usuario_v;

  IF id_usuario_v IS NOT NULL THEN
    PERFORM crear_registro_actividad(id_usuario, 'Actualizar contraseña');
    RETURN TRUE;
  ELSE
    RETURN FALSE;
  END IF;
END
$$ LANGUAGE plpgsql;


--
-- TRANSACCIÓN: ACTUALIZAR NÚMERO DE TELÉFONO
--
CREATE OR REPLACE FUNCTION actualizar_numero_telefono(id_usuario INT, id_cuenta INT, nuevo_numero_telefono VARCHAR(10))
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE cuentas
  SET numero_telefono = nuevo_numero_telefono
  WHERE id = id_cuenta;

  PERFORM crear_registro_actividad(id_usuario, 'Actualizar número de teléfono');

  RETURN TRUE;
END
$$ LANGUAGE plpgsql;


--
-- TRANSACCIÓN: ACTIVAR SALDO OCULTO
--
CREATE OR REPLACE FUNCTION activar_saldo_oculto(id_usuario INT, id_cuenta INT)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE cuentas
  SET saldo_oculto = TRUE
  WHERE id = id_cuenta;

  PERFORM crear_registro_actividad(id_usuario, 'Activar saldo oculto');

  RETURN TRUE;
END
$$ LANGUAGE plpgsql;


--
-- TRANSACCIÓN: DESACTIVAR SALDO OCULTO
--
CREATE OR REPLACE FUNCTION desactivar_saldo_oculto(id_usuario INT, id_cuenta INT)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE cuentas
  SET saldo_oculto = FALSE
  WHERE id = id_cuenta;

  PERFORM crear_registro_actividad(id_usuario, 'Desactivar saldo oculto');

  RETURN TRUE;
END
$$ LANGUAGE plpgsql;


--
-- TRANSACCIÓN: BLOQUEAR CUENTA
--
CREATE OR REPLACE FUNCTION bloquear_cuenta(id_usuario INT, id_cuenta INT)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE cuentas
  SET habilitada = FALSE
  WHERE id = id_cuenta;

  PERFORM crear_registro_actividad(id_usuario, 'Bloquear cuenta');

  RETURN TRUE;
END
$$ LANGUAGE plpgsql;


--
-- TRANSACCIÓN: DESBLOQUEAR CUENTA
--
CREATE OR REPLACE FUNCTION desbloquear_cuenta(id_usuario INT, id_cuenta INT)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE cuentas
  SET habilitada = TRUE
  WHERE id = id_cuenta;

  PERFORM crear_registro_actividad(id_usuario, 'Desbloquear cuenta');

  RETURN TRUE;
END
$$ LANGUAGE plpgsql;


--
-- TRANSACCIÓN: CONSULTAR ÚLTIMOS MOVIMIENTOS
--
CREATE OR REPLACE FUNCTION consultar_ultimos_movimientos(id_cuenta INT, numero_movimientos INT)
RETURNS TABLE (
  id_movimiento INT,
	tipo_movimiento VARCHAR(30),
	fecha_hora TIMESTAMP,
	monto DECIMAL(16,2)
) AS $$
BEGIN
  RETURN QUERY SELECT * FROM (
    SELECT
    mov.id AS id_movimiento,
    'Transferencia interna'::VARCHAR(30) AS tipo_movimiento,
    mov.fecha_hora AS fecha_hora,
    (mov.monto * -1) AS monto
    FROM movimientos mov
    INNER JOIN transferencias_internas ti ON ti.id_movimiento = mov.id
    WHERE mov.cuenta_origen = id_cuenta

    UNION ALL
  
    SELECT
    mov.id AS id_movimiento,
    'Transferencia interna'::VARCHAR(30) AS tipo_movimiento,
    mov.fecha_hora AS fecha_hora,
    mov.monto AS monto
    FROM movimientos mov
    INNER JOIN transferencias_internas ti ON ti.id_movimiento = mov.id
    WHERE ti.cuenta_destino = id_cuenta
  
    UNION ALL
  
    SELECT
    mov.id AS id_movimiento,
    'Transferencia externa'::VARCHAR(30) AS tipo_movimiento,
    mov.fecha_hora AS fecha_hora,
    (mov.monto * -1) AS monto
    FROM movimientos mov
    INNER JOIN transferencias_externas te ON te.id_movimiento = mov.id
    WHERE mov.cuenta_origen = id_cuenta AND te.carga = FALSE

    UNION ALL

    SELECT
    mov.id AS id_movimiento,
    'Transferencia externa'::VARCHAR(30) AS tipo_movimiento,
    mov.fecha_hora AS fecha_hora,
    mov.monto AS monto
    FROM movimientos mov
    INNER JOIN transferencias_externas te ON te.id_movimiento = mov.id
    WHERE mov.cuenta_origen = id_cuenta AND te.carga = TRUE
  
    UNION ALL

    SELECT
    mov.id AS id_movimiento,
    'Pago factura'::VARCHAR(30) AS tipo_movimiento,
    mov.fecha_hora AS fecha_hora,
    (mov.monto * -1) AS monto
    FROM movimientos mov
    INNER JOIN facturas ft ON ft.id_movimiento = mov.id
    WHERE mov.cuenta_origen = id_cuenta
  
    UNION ALL
  
    SELECT
    mov.id AS id_movimiento,
    'Recarga cívica'::VARCHAR(30) AS tipo_movimiento,
    mov.fecha_hora AS fecha_hora,
    (mov.monto * -1) AS monto
    FROM movimientos mov
    INNER JOIN recargas_civica rc ON rc.id_movimiento = mov.id
    WHERE mov.cuenta_origen = id_cuenta
  
    UNION ALL
  
    SELECT
    mov.id AS id_movimiento,
    'Recarga telefonía'::VARCHAR(30) AS tipo_movimiento,
    mov.fecha_hora AS fecha_hora,
    (mov.monto * -1) AS monto
    FROM movimientos mov
    INNER JOIN recargas_telefonia rt ON rt.id_movimiento = mov.id
    WHERE mov.cuenta_origen = id_cuenta
  
    UNION ALL
  
    SELECT
    mov.id AS id_movimiento,
    'Paquete telefonía'::VARCHAR(30) AS tipo_movimiento,
    mov.fecha_hora AS fecha_hora,
    (mov.monto * -1) AS monto
    FROM movimientos mov
    INNER JOIN paquetes_telefonia pt ON pt.id_movimiento = mov.id
    WHERE mov.cuenta_origen = id_cuenta
  
    UNION ALL
  
    SELECT
    mov.id AS id_movimiento,
    'Recarga'::VARCHAR(30) AS tipo_movimiento,
    mov.fecha_hora AS fecha_hora,
    mov.monto AS monto
    FROM movimientos mov
    INNER JOIN recargas rc ON rc.id_movimiento = mov.id
    WHERE mov.cuenta_origen = id_cuenta
  
    UNION ALL
  
    SELECT
    mov.id AS id_movimiento,
    'Retiro'::VARCHAR(30) AS tipo_movimiento,
    mov.fecha_hora AS fecha_hora,
    (mov.monto * -1) AS monto
    FROM movimientos mov
    INNER JOIN retiros rt ON rt.id_movimiento = mov.id
    WHERE mov.cuenta_origen = id_cuenta

    UNION ALL

    SELECT
    mov.id AS id_movimiento,
    'Carga a bolsillo'::VARCHAR(30) AS tipo_movimiento,
    mov.fecha_hora AS fecha_hora,
    (mov.monto * -1) AS monto
    FROM movimientos mov
    INNER JOIN transferencias_bolsillos trb ON trb.id_movimiento = mov.id
    WHERE mov.cuenta_origen = id_cuenta AND trb.tipo = 'Carga'

    UNION ALL

    SELECT
    mov.id AS id_movimiento,
    'Descarga desde bolsillo'::VARCHAR(30) AS tipo_movimiento,
    mov.fecha_hora AS fecha_hora,
    mov.monto AS monto
    FROM movimientos mov
    INNER JOIN transferencias_bolsillos trb ON trb.id_movimiento = mov.id
    WHERE mov.cuenta_origen = id_cuenta AND trb.tipo = 'Descarga'
  ) movimientos
	ORDER BY movimientos.fecha_hora DESC
	LIMIT numero_movimientos;
END;
$$ LANGUAGE plpgsql;


--
-- TRANSACCIÓN: REGISTRAR MOVIMIENTO
--
CREATE OR REPLACE FUNCTION registrar_movimiento(id_cuenta INT, monto DECIMAL(16,2))
RETURNS INT AS $$
DECLARE
	id_movimiento INT;
BEGIN
	INSERT INTO movimientos (cuenta_origen, monto)
	VALUES (id_cuenta, monto)
  RETURNING id INTO id_movimiento;
	
  IF id_movimiento IS NOT NULL THEN
    RETURN id_movimiento;
  ELSE
    RETURN -1;
  END IF;
END;
$$ LANGUAGE plpgsql;


--
-- TRANSACCIÓN: CONSULTAR SALDO DE CUENTA
--
CREATE OR REPLACE FUNCTION consultar_saldo(id_cuenta INT)
RETURNS TABLE(
  saldo DECIMAL(16,2),
  saldo_bolsillos DECIMAL(16,2)
) AS $$
BEGIN
  SELECT cuentas.saldo_disponible
  FROM cuentas
  WHERE cuentas.id = consultar_saldo.id_cuenta
  INTO saldo;

  SELECT COALESCE(SUM(bolsillos.saldo_disponible), 0)
  FROM bolsillos
  WHERE bolsillos.id_cuenta = consultar_saldo.id_cuenta AND bolsillos.eliminado = FALSE
  INTO saldo_bolsillos;

  RETURN NEXT;
END;
$$ LANGUAGE plpgsql;


--
-- TRANSACCIÓN: VERIFICAR SALDO SUFICIENTE
--
CREATE OR REPLACE FUNCTION verificar_saldo_suficiente(id_cuenta INT, monto DECIMAL(16,2))
RETURNS BOOLEAN AS $$
DECLARE
	saldo DECIMAL(16,2);
BEGIN
	SELECT cuentas.saldo_disponible
  FROM cuentas
  WHERE cuentas.id = verificar_saldo_suficiente.id_cuenta
  INTO saldo;

  RETURN saldo >= monto;
END;
$$ LANGUAGE plpgsql;


--
-- TRANSACCIÓN: SUMAR SALDO
--
CREATE OR REPLACE FUNCTION sumar_saldo(id_cuenta INT, monto DECIMAL(16,2))
RETURNS BOOLEAN AS $$
BEGIN
	UPDATE cuentas
  SET saldo_disponible = saldo_disponible + monto
  WHERE cuentas.id = sumar_saldo.id_cuenta;

  IF FOUND THEN
    RETURN TRUE;
  ELSE
    RETURN FALSE;
  END IF;
END;
$$ LANGUAGE plpgsql;


--
-- TRANSACCIÓN: RESTAR SALDO
--
CREATE OR REPLACE FUNCTION restar_saldo(id_cuenta INT, monto DECIMAL(16,2))
RETURNS BOOLEAN AS $$
BEGIN
	UPDATE cuentas
  SET saldo_disponible = saldo_disponible - monto
  WHERE cuentas.id = restar_saldo.id_cuenta;

  IF FOUND THEN
    RETURN TRUE;
  ELSE
    RETURN FALSE;
  END IF;
END;
$$ LANGUAGE plpgsql;


--
-- TRANSACCIÓN: REALIZAR TRANSFERENCIA INTERNA
--
CREATE OR REPLACE FUNCTION realizar_transferencia_interna(p_id_cuenta_origen INT, p_id_cuenta_destino INT, p_monto DECIMAL(16,2))
RETURNS TABLE(
  id_movimiento INT,
	tipo_movimiento VARCHAR(30),
  id_cuenta_destino INT,
  fecha_hora TIMESTAMP,
	monto DECIMAL(16,2)
) AS $$
DECLARE
	saldo_suficiente BOOLEAN;
  id_movimiento INT;
BEGIN
	SELECT verificar_saldo_suficiente(p_id_cuenta_origen, p_monto)
  INTO saldo_suficiente;

  IF saldo_suficiente THEN
    SELECT registrar_movimiento(p_id_cuenta_origen, p_monto)
    INTO id_movimiento;

    IF id_movimiento <> -1 THEN
      INSERT INTO transferencias_internas (id_movimiento, cuenta_destino)
      VALUES (id_movimiento, p_id_cuenta_destino);

      PERFORM sumar_saldo(p_id_cuenta_destino, p_monto);
      PERFORM restar_saldo(p_id_cuenta_origen, p_monto);

      RETURN QUERY (
        SELECT id_movimiento, 'Transferencia interna'::VARCHAR(30), p_id_cuenta_destino, NOW()::TIMESTAMP, p_monto
      );
    ELSE
      RETURN QUERY (
        SELECT NULL::INT, NULL::VARCHAR(30), NULL::INT, NULL::TIMESTAMP, NULL::DECIMAL(16,2)
        WHERE FALSE
      );
    END IF;
  ELSE
    RETURN QUERY (
      SELECT NULL::INT, NULL::VARCHAR(30), NULL::INT, NULL::TIMESTAMP, NULL::DECIMAL(16,2)
      WHERE FALSE
    );
  END IF;
END;
$$ LANGUAGE plpgsql;


--
-- TRANSACCIÓN: REALIZAR TRANSFERENCIA EXTERNA
--
CREATE OR REPLACE FUNCTION realizar_transferencia_externa(p_id_cuenta_origen INT, p_entidad_destino VARCHAR(20), p_cuenta_destino VARCHAR(15), p_monto DECIMAL(16,2))
RETURNS TABLE(
  id_movimiento INT,
	tipo_movimiento VARCHAR(30),
  entidad_destino VARCHAR(20),
  cuenta_destino VARCHAR(15),
  fecha_hora TIMESTAMP,
	monto DECIMAL(16,2)
) AS $$
DECLARE
	saldo_suficiente BOOLEAN;
  id_movimiento INT;
BEGIN
	SELECT verificar_saldo_suficiente(p_id_cuenta_origen, p_monto)
  INTO saldo_suficiente;

  IF saldo_suficiente THEN
    SELECT registrar_movimiento(p_id_cuenta_origen, p_monto)
    INTO id_movimiento;

    IF id_movimiento <> -1 THEN
      INSERT INTO transferencias_externas (id_movimiento, entidad_destino, cuenta_destino)
      VALUES (id_movimiento, p_entidad_destino, p_cuenta_destino);

      PERFORM restar_saldo(p_id_cuenta_origen, p_monto);

      RETURN QUERY (
        SELECT id_movimiento, 'Transferencia externa'::VARCHAR(30), p_entidad_destino, p_cuenta_destino, NOW()::TIMESTAMP, p_monto
      );
    ELSE
      RETURN QUERY (
        SELECT NULL::INT, NULL::VARCHAR(30), NULL::VARCHAR(20), NULL::VARCHAR(15), NULL::TIMESTAMP, NULL::DECIMAL(16,2)
        WHERE FALSE
      );
    END IF;
  ELSE
    RETURN QUERY (
      SELECT NULL::INT, NULL::VARCHAR(30), NULL::VARCHAR(20), NULL::VARCHAR(15), NULL::TIMESTAMP, NULL::DECIMAL(16,2)
      WHERE FALSE
    );
  END IF;
END;
$$ LANGUAGE plpgsql;


--
-- TRANSACCIÓN: REALIZAR TRANSFERENCIA EXTERNA (DE CARGA)
--
CREATE OR REPLACE FUNCTION realizar_transferencia_externa_carga(p_id_cuenta_origen INT, p_entidad_destino VARCHAR(20), p_cuenta_destino VARCHAR(15), p_monto DECIMAL(16,2))
RETURNS TABLE(
  id_movimiento INT,
	tipo_movimiento VARCHAR(30),
  entidad_destino VARCHAR(20),
  cuenta_destino VARCHAR(15),
  fecha_hora TIMESTAMP,
	monto DECIMAL(16,2)
) AS $$
DECLARE
	saldo_suficiente BOOLEAN;
  id_movimiento INT;
BEGIN
	SELECT verificar_saldo_suficiente(p_id_cuenta_origen, p_monto)
  INTO saldo_suficiente;

  IF saldo_suficiente THEN
    SELECT registrar_movimiento(p_id_cuenta_origen, p_monto)
    INTO id_movimiento;

    IF id_movimiento <> -1 THEN
      INSERT INTO transferencias_externas (id_movimiento, entidad_destino, cuenta_destino, carga)
      VALUES (id_movimiento, p_entidad_destino, p_cuenta_destino, TRUE);

      PERFORM restar_saldo(p_id_cuenta_origen, p_monto);

      RETURN QUERY (
        SELECT id_movimiento, 'Transferencia externa'::VARCHAR(30), p_entidad_destino, p_cuenta_destino, NOW()::TIMESTAMP, p_monto
      );
    ELSE
      RETURN QUERY (
        SELECT NULL::INT, NULL::VARCHAR(30), NULL::VARCHAR(20), NULL::VARCHAR(15), NULL::TIMESTAMP, NULL::DECIMAL(16,2)
        WHERE FALSE
      );
    END IF;
  ELSE
    RETURN QUERY (
      SELECT NULL::INT, NULL::VARCHAR(30), NULL::VARCHAR(20), NULL::VARCHAR(15), NULL::TIMESTAMP, NULL::DECIMAL(16,2)
      WHERE FALSE
    );
  END IF;
END;
$$ LANGUAGE plpgsql;


--
-- TRANSACCIÓN: REALIZAR PAGO DE FACTURA
--
CREATE OR REPLACE FUNCTION realizar_pago_factura(p_id_cuenta_origen INT, p_referencia VARCHAR(30), p_descripcion VARCHAR(20), p_monto DECIMAL(16,2))
RETURNS TABLE(
  id_movimiento INT,
	tipo_movimiento VARCHAR(30),
  referencia VARCHAR(30),
  descripcion VARCHAR(20),
  fecha_hora TIMESTAMP,
	monto DECIMAL(16,2)
) AS $$
DECLARE
	saldo_suficiente BOOLEAN;
  id_movimiento INT;
BEGIN
	SELECT verificar_saldo_suficiente(p_id_cuenta_origen, p_monto)
  INTO saldo_suficiente;

  IF saldo_suficiente THEN
    SELECT registrar_movimiento(p_id_cuenta_origen, p_monto)
    INTO id_movimiento;

    IF id_movimiento <> -1 THEN
      INSERT INTO facturas (id_movimiento, descripcion, referencia)
      VALUES (id_movimiento, p_descripcion, p_referencia);

      PERFORM restar_saldo(p_id_cuenta_origen, p_monto);

      RETURN QUERY (
        SELECT id_movimiento, 'Pago de factura'::VARCHAR(30), p_referencia, p_descripcion, NOW()::TIMESTAMP, p_monto
      );
    ELSE
      RETURN QUERY (
        SELECT NULL::INT, NULL::VARCHAR(30), NULL::VARCHAR(30), NULL::VARCHAR(20), NULL::TIMESTAMP, NULL::DECIMAL(16,2)
        WHERE FALSE
      );
    END IF;
  ELSE
    RETURN QUERY (
      SELECT NULL::INT, NULL::VARCHAR(30), NULL::VARCHAR(30), NULL::VARCHAR(20), NULL::TIMESTAMP, NULL::DECIMAL(16,2)
      WHERE FALSE
    );
  END IF;
END;
$$ LANGUAGE plpgsql;


--
-- TRANSACCIÓN: REALIZAR RECARGA A TARJETA CÍVICA
--
CREATE OR REPLACE FUNCTION realizar_recarga_civica(p_id_cuenta_origen INT, p_tipo_documento VARCHAR(2), p_numero_documento VARCHAR(10), p_monto DECIMAL(16,2))
RETURNS TABLE(
  id_movimiento INT,
	tipo_movimiento VARCHAR(30),
  tipo_documento VARCHAR(2),
  numero_documento VARCHAR(10),
  fecha_hora TIMESTAMP,
	monto DECIMAL(16,2)
) AS $$
DECLARE
	saldo_suficiente BOOLEAN;
  id_movimiento INT;
BEGIN
	SELECT verificar_saldo_suficiente(p_id_cuenta_origen, p_monto)
  INTO saldo_suficiente;

  IF saldo_suficiente THEN
    SELECT registrar_movimiento(p_id_cuenta_origen, p_monto)
    INTO id_movimiento;

    IF id_movimiento <> -1 THEN
      INSERT INTO recargas_civica (id_movimiento, tipo_documento, numero_documento)
      VALUES (id_movimiento, p_tipo_documento, p_numero_documento);

      PERFORM restar_saldo(p_id_cuenta_origen, p_monto);

      RETURN QUERY (
        SELECT id_movimiento, 'Recarga a tarjeta cívica'::VARCHAR(30), p_tipo_documento, p_numero_documento, NOW()::TIMESTAMP, p_monto
      );
    ELSE
      RETURN QUERY (
        SELECT NULL::INT, NULL::VARCHAR(30), NULL::VARCHAR(2), NULL::VARCHAR(10), NULL::TIMESTAMP, NULL::DECIMAL(16,2)
        WHERE FALSE
      );
    END IF;
  ELSE
    RETURN QUERY (
      SELECT NULL::INT, NULL::VARCHAR(30), NULL::VARCHAR(2), NULL::VARCHAR(10), NULL::TIMESTAMP, NULL::DECIMAL(16,2)
      WHERE FALSE
    );
  END IF;
END;
$$ LANGUAGE plpgsql;


--
-- TRANSACCIÓN: REALIZAR RECARGA A TELEFONÍA MÓVIL
--
CREATE OR REPLACE FUNCTION realizar_recarga_telefonia(p_id_cuenta_origen INT, p_operador VARCHAR(20), p_numero_telefono VARCHAR(10), p_monto DECIMAL(16,2))
RETURNS TABLE(
  id_movimiento INT,
	tipo_movimiento VARCHAR(30),
  operador VARCHAR(20),
  numero_telefono VARCHAR(10),
  fecha_hora TIMESTAMP,
	monto DECIMAL(16,2)
) AS $$
DECLARE
	saldo_suficiente BOOLEAN;
  id_movimiento INT;
BEGIN
	SELECT verificar_saldo_suficiente(p_id_cuenta_origen, p_monto)
  INTO saldo_suficiente;

  IF saldo_suficiente THEN
    SELECT registrar_movimiento(p_id_cuenta_origen, p_monto)
    INTO id_movimiento;

    IF id_movimiento <> -1 THEN
      INSERT INTO recargas_telefonia (id_movimiento, operador, numero)
      VALUES (id_movimiento, p_operador, p_numero_telefono);

      PERFORM restar_saldo(p_id_cuenta_origen, p_monto);

      RETURN QUERY (
        SELECT id_movimiento, 'Recarga a telefonía móvil'::VARCHAR(30), p_operador, p_numero_telefono, NOW()::TIMESTAMP, p_monto
      );
    ELSE
      RETURN QUERY (
        SELECT NULL::INT, NULL::VARCHAR(30), NULL::VARCHAR(20), NULL::VARCHAR(10), NULL::TIMESTAMP, NULL::DECIMAL(16,2)
        WHERE FALSE
      );
    END IF;
  ELSE
    RETURN QUERY (
      SELECT NULL::INT, NULL::VARCHAR(30), NULL::VARCHAR(20), NULL::VARCHAR(10), NULL::TIMESTAMP, NULL::DECIMAL(16,2)
      WHERE FALSE
    );
  END IF;
END;
$$ LANGUAGE plpgsql;


--
-- TRANSACCIÓN: REALIZAR PAGO DE PAQUETE DE TELEFONÍA MÓVIL
--
CREATE OR REPLACE FUNCTION realizar_pago_paquete_telefonia(p_id_cuenta_origen INT, p_operador VARCHAR(20), p_nombre VARCHAR(30), p_numero_telefono VARCHAR(10), p_monto DECIMAL(16,2))
RETURNS TABLE(
  id_movimiento INT,
	tipo_movimiento VARCHAR(30),
  operador VARCHAR(20),
  nombre VARCHAR(30),
  numero_telefono VARCHAR(10),
  fecha_hora TIMESTAMP,
	monto DECIMAL(16,2)
) AS $$
DECLARE
	saldo_suficiente BOOLEAN;
  id_movimiento INT;
BEGIN
	SELECT verificar_saldo_suficiente(p_id_cuenta_origen, p_monto)
  INTO saldo_suficiente;

  IF saldo_suficiente THEN
    SELECT registrar_movimiento(p_id_cuenta_origen, p_monto)
    INTO id_movimiento;

    IF id_movimiento <> -1 THEN
      INSERT INTO paquetes_telefonia (id_movimiento, operador, nombre, numero)
      VALUES (id_movimiento, p_operador, p_nombre, p_numero_telefono);

      PERFORM restar_saldo(p_id_cuenta_origen, p_monto);

      RETURN QUERY (
        SELECT id_movimiento, 'Pago de paquete de telefonía'::VARCHAR(30), p_operador, p_nombre, p_numero_telefono, NOW()::TIMESTAMP, p_monto
      );
    ELSE
      RETURN QUERY (
        SELECT NULL::INT, NULL::VARCHAR(30), NULL::VARCHAR(20), NULL::VARCHAR(30), NULL::VARCHAR(10), NULL::TIMESTAMP, NULL::DECIMAL(16,2)
        WHERE FALSE
      );
    END IF;
  ELSE
    RETURN QUERY (
      SELECT NULL::INT, NULL::VARCHAR(30), NULL::VARCHAR(20), NULL::VARCHAR(30), NULL::VARCHAR(10), NULL::TIMESTAMP, NULL::DECIMAL(16,2)
      WHERE FALSE
    );
  END IF;
END;
$$ LANGUAGE plpgsql;


--
-- TRANSACCIÓN: REALIZAR RECARGA A CUENTA
--
CREATE OR REPLACE FUNCTION realizar_recarga_cuenta(p_id_cuenta_destino INT, p_corresponsal VARCHAR(30), p_monto DECIMAL(16,2))
RETURNS TABLE(
  id_movimiento INT,
	tipo_movimiento VARCHAR(30),
  id_cuenta_destino INT,
  corresponsal VARCHAR(30),
  fecha_hora TIMESTAMP,
	monto DECIMAL(16,2)
) AS $$
DECLARE
	saldo_suficiente BOOLEAN;
  id_movimiento INT;
BEGIN
  SELECT registrar_movimiento(p_id_cuenta_destino, p_monto)
  INTO id_movimiento;

  IF id_movimiento <> -1 THEN
    INSERT INTO recargas (id_movimiento, corresponsal)
    VALUES (id_movimiento, p_corresponsal);

    PERFORM sumar_saldo(p_id_cuenta_destino, p_monto);

    RETURN QUERY (
      SELECT id_movimiento, 'Recarga a cuenta'::VARCHAR(30), p_id_cuenta_destino, p_corresponsal, NOW()::TIMESTAMP, p_monto
    );
  ELSE
    RETURN QUERY (
      SELECT NULL::INT, NULL::VARCHAR(30), NULL::INT, NULL::VARCHAR(30), NULL::TIMESTAMP, NULL::DECIMAL(16,2)
      WHERE FALSE
    );
  END IF;
END;
$$ LANGUAGE plpgsql;


--
-- TRANSACCIÓN: REALIZAR RETIRO DESDE CUENTA
--
CREATE OR REPLACE FUNCTION realizar_retiro_cuenta(p_id_cuenta_origen INT, p_corresponsal VARCHAR(30), p_monto DECIMAL(16,2))
RETURNS TABLE(
  id_movimiento INT,
	tipo_movimiento VARCHAR(30),
  id_cuenta_origen INT,
  corresponsal VARCHAR(30),
  fecha_hora TIMESTAMP,
	monto DECIMAL(16,2)
) AS $$
DECLARE
	saldo_suficiente BOOLEAN;
  id_movimiento INT;
BEGIN
	SELECT verificar_saldo_suficiente(p_id_cuenta_origen, p_monto)
  INTO saldo_suficiente;

  IF saldo_suficiente THEN
    SELECT registrar_movimiento(p_id_cuenta_origen, p_monto)
    INTO id_movimiento;

    IF id_movimiento <> -1 THEN
      INSERT INTO retiros (id_movimiento, corresponsal)
      VALUES (id_movimiento, p_corresponsal);

      PERFORM restar_saldo(p_id_cuenta_origen, p_monto);

      RETURN QUERY (
        SELECT id_movimiento, 'Retiro desde cuenta'::VARCHAR(30), p_id_cuenta_origen, p_corresponsal, NOW()::TIMESTAMP, p_monto
      );
    ELSE
      RETURN QUERY (
        SELECT NULL::INT, NULL::VARCHAR(30), NULL::INT, NULL::VARCHAR(30), NULL::TIMESTAMP, NULL::DECIMAL(16,2)
        WHERE FALSE
      );
    END IF;
  ELSE
    RETURN QUERY (
      SELECT NULL::INT, NULL::VARCHAR(30), NULL::INT, NULL::VARCHAR(30), NULL::TIMESTAMP, NULL::DECIMAL(16,2)
      WHERE FALSE
    );
  END IF;
END;
$$ LANGUAGE plpgsql;


--
-- TRANSACCIÓN: CREAR BOLSILLO
--
CREATE OR REPLACE FUNCTION crear_bolsillo(p_id_usuario INT, p_id_cuenta INT, p_nombre VARCHAR(20), p_saldo_objetivo DECIMAL(16,2))
RETURNS TABLE(
  id_bolsillo INT,
	nombre VARCHAR(20),
	saldo_disponible DECIMAL(16,2),
	saldo_objetivo DECIMAL(16,2)
) AS $$
DECLARE
  v_id_bolsillo INT;
BEGIN
	INSERT INTO bolsillos (id_cuenta, nombre, saldo_objetivo)
  VALUES (p_id_cuenta, p_nombre, p_saldo_objetivo)
  RETURNING id INTO v_id_bolsillo;

  PERFORM crear_registro_actividad(p_id_usuario, 'Crear bolsillo');

  RETURN QUERY (
    SELECT v_id_bolsillo, p_nombre, 0::DECIMAL(16,2), p_saldo_objetivo
  );
END;
$$ LANGUAGE plpgsql;


--
-- TRANSACCIÓN: REALIZAR CARGA A BOLSILLO
--
CREATE OR REPLACE FUNCTION realizar_carga_bolsillo(p_id_bolsillo INT, p_monto DECIMAL(16,2))
RETURNS TABLE(
  id_movimiento INT,
	tipo_movimiento VARCHAR(30),
  id_bolsillo INT,
  fecha_hora TIMESTAMP,
	monto DECIMAL(16,2)
) AS $$
DECLARE
  v_id_cuenta INT;
	saldo_suficiente BOOLEAN;
  id_movimiento INT;
BEGIN
  SELECT id_cuenta
  FROM bolsillos
  WHERE id = p_id_bolsillo
  INTO v_id_cuenta;

  IF v_id_cuenta IS NOT NULL THEN
    SELECT verificar_saldo_suficiente(v_id_cuenta, p_monto)
    INTO saldo_suficiente;

    IF saldo_suficiente THEN
      SELECT registrar_movimiento(v_id_cuenta, p_monto)
      INTO id_movimiento;

      IF id_movimiento <> -1 THEN
        INSERT INTO transferencias_bolsillos (id_movimiento, id_bolsillo, tipo)
        VALUES (id_movimiento, p_id_bolsillo, 'Carga');

        PERFORM restar_saldo(v_id_cuenta, p_monto);

        UPDATE bolsillos
        SET saldo_disponible = saldo_disponible + p_monto
        WHERE id = p_id_bolsillo;

        RETURN QUERY (
          SELECT id_movimiento, 'Carga a bolsillo'::VARCHAR(30), p_id_bolsillo, NOW()::TIMESTAMP, p_monto
        );
      ELSE
        RETURN QUERY (
          SELECT NULL::INT, NULL::VARCHAR(30), NULL::INT, NULL::TIMESTAMP, NULL::DECIMAL(16,2)
          WHERE FALSE
        );
      END IF;
    ELSE
      RETURN QUERY (
        SELECT NULL::INT, NULL::VARCHAR(30), NULL::INT, NULL::TIMESTAMP, NULL::DECIMAL(16,2)
        WHERE FALSE
      );
    END IF;
  ELSE
    RETURN QUERY (
      SELECT NULL::INT, NULL::VARCHAR(30), NULL::INT, NULL::TIMESTAMP, NULL::DECIMAL(16,2)
      WHERE FALSE
    );
  END IF;
END;
$$ LANGUAGE plpgsql;


--
-- TRANSACCIÓN: REALIZAR DESCARGA DESDE BOLSILLO
--
CREATE OR REPLACE FUNCTION realizar_descarga_bolsillo(p_id_bolsillo INT, p_monto DECIMAL(16,2))
RETURNS TABLE(
  id_movimiento INT,
	tipo_movimiento VARCHAR(30),
  id_bolsillo INT,
  fecha_hora TIMESTAMP,
	monto DECIMAL(16,2)
) AS $$
DECLARE
  v_id_cuenta INT;
	saldo_suficiente BOOLEAN;
  id_movimiento INT;
BEGIN
  SELECT id_cuenta
  FROM bolsillos
  WHERE id = p_id_bolsillo
  INTO v_id_cuenta;

  IF v_id_cuenta IS NOT NULL THEN
    SELECT saldo_disponible >= p_monto
    FROM bolsillos
    WHERE id = p_id_bolsillo
    INTO saldo_suficiente;

    IF saldo_suficiente THEN
      SELECT registrar_movimiento(v_id_cuenta, p_monto)
      INTO id_movimiento;

      IF id_movimiento <> -1 THEN
        INSERT INTO transferencias_bolsillos (id_movimiento, id_bolsillo, tipo)
        VALUES (id_movimiento, p_id_bolsillo, 'Descarga');

        UPDATE bolsillos
        SET saldo_disponible = saldo_disponible - p_monto
        WHERE id = p_id_bolsillo;

        PERFORM sumar_saldo(v_id_cuenta, p_monto);

        RETURN QUERY (
          SELECT id_movimiento, 'Descarga desde bolsillo'::VARCHAR(30), p_id_bolsillo, NOW()::TIMESTAMP, p_monto
        );
      ELSE
        RETURN QUERY (
          SELECT NULL::INT, NULL::VARCHAR(30), NULL::INT, NULL::TIMESTAMP, NULL::DECIMAL(16,2)
          WHERE FALSE
        );
      END IF;
    ELSE
      RETURN QUERY (
        SELECT NULL::INT, NULL::VARCHAR(30), NULL::INT, NULL::TIMESTAMP, NULL::DECIMAL(16,2)
        WHERE FALSE
      );
    END IF;
  ELSE
    RETURN QUERY (
      SELECT NULL::INT, NULL::VARCHAR(30), NULL::INT, NULL::TIMESTAMP, NULL::DECIMAL(16,2)
      WHERE FALSE
    );
  END IF;
END;
$$ LANGUAGE plpgsql;


--
-- TRANSACCIÓN: EDITAR BOLSILLO
--
CREATE OR REPLACE FUNCTION editar_bolsillo(p_id_usuario INT, p_id_bolsillo INT, p_nuevo_nombre VARCHAR(20), p_nuevo_saldo_objetivo DECIMAL(16,2))
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE bolsillos
  SET nombre = p_nuevo_nombre, saldo_objetivo = p_nuevo_saldo_objetivo
  WHERE id = p_id_bolsillo;

  PERFORM crear_registro_actividad(p_id_usuario, 'Editar bolsillo');

  RETURN TRUE;
END
$$ LANGUAGE plpgsql;


--
-- TRANSACCIÓN: ELIMINAR BOLSILLO
--
CREATE OR REPLACE FUNCTION eliminar_bolsillo(p_id_usuario INT, p_id_bolsillo INT)
RETURNS BOOLEAN AS $$
DECLARE
  bolsillo_descargado BOOLEAN;
BEGIN
  SELECT saldo_disponible = 0
  FROM bolsillos
  WHERE id = p_id_bolsillo
  INTO bolsillo_descargado;

  IF bolsillo_descargado THEN
    UPDATE bolsillos
    SET eliminado = TRUE
    WHERE id = p_id_bolsillo;

    PERFORM crear_registro_actividad(p_id_usuario, 'Eliminar bolsillo');

    RETURN TRUE;
  ELSE
    RETURN FALSE;
  END IF;
END
$$ LANGUAGE plpgsql;


--
-- TRANSACCIÓN: CONSULTAR ÚLTIMOS MOVIMIENTOS DE UN BOLSILLO
--
CREATE OR REPLACE FUNCTION consultar_ultimos_movimientos_bolsillo(p_id_bolsillo INT)
RETURNS TABLE (
  id_movimiento INT,
	tipo_movimiento VARCHAR(10),
	fecha_hora TIMESTAMP,
	monto DECIMAL(16,2)
) AS $$
BEGIN
  RETURN QUERY SELECT * FROM (
    SELECT
    mov.id AS id_movimiento,
    'Carga'::VARCHAR(10) AS tipo_movimiento,
    mov.fecha_hora AS fecha_hora,
    mov.monto AS monto
    FROM movimientos mov
    INNER JOIN transferencias_bolsillos trb ON trb.id_movimiento = mov.id
    WHERE trb.id_bolsillo = p_id_bolsillo AND trb.tipo = 'Carga'

    UNION ALL

    SELECT
    mov.id AS id_movimiento,
    'Descarga'::VARCHAR(10) AS tipo_movimiento,
    mov.fecha_hora AS fecha_hora,
    (mov.monto * -1) AS monto
    FROM movimientos mov
    INNER JOIN transferencias_bolsillos trb ON trb.id_movimiento = mov.id
    WHERE trb.id_bolsillo = p_id_bolsillo AND trb.tipo = 'Descarga'
  ) movimientos_bolsillos
  WHERE movimientos_bolsillos.fecha_hora >= (NOW() - INTERVAL '3 months')
	ORDER BY movimientos_bolsillos.fecha_hora DESC
	LIMIT 30;
END;
$$ LANGUAGE plpgsql;


--
-- TRANSACCIÓN: CONSULTAR BOLSILLOS
--
CREATE OR REPLACE FUNCTION consultar_bolsillos(p_id_cuenta INT)
RETURNS TABLE(
  id_bolsillo INT,
	nombre VARCHAR(20),
	saldo_disponible DECIMAL(16,2),
	saldo_objetivo DECIMAL(16,2)
) AS $$
BEGIN
	RETURN QUERY (
    SELECT bol.id, bol.nombre, bol.saldo_disponible, bol.saldo_objetivo
    FROM bolsillos bol
    WHERE id_cuenta = p_id_cuenta AND eliminado = FALSE
  );
END;
$$ LANGUAGE plpgsql;


--
-- TRANSACCIÓN: VERIFICAR SALDO SUFICIENTE DE UN BOLSILLO
--
CREATE OR REPLACE FUNCTION verificar_saldo_suficiente_bolsillo(p_id_bolsillo INT, monto DECIMAL(16,2))
RETURNS BOOLEAN AS $$
DECLARE
  saldo DECIMAL(16,2);
BEGIN
	SELECT bolsillos.saldo_disponible
  FROM bolsillos
  WHERE bolsillos.id = p_id_bolsillo
  INTO saldo;

  RETURN saldo >= monto;
END;
$$ LANGUAGE plpgsql;


--
-- TRANSACCIÓN: CONSULTAR ÚLTIMOS REGISTROS DE ACTIVIDAD
--
CREATE OR REPLACE FUNCTION consultar_ultimos_registros(p_id_usuario INT)
RETURNS TABLE (
  id INT,
	accion VARCHAR(50),
	fecha_hora TIMESTAMP
) AS $$
BEGIN
  RETURN QUERY SELECT * FROM (
    SELECT reg.id, reg.accion, reg.fecha_hora
    FROM registros reg
    WHERE id_usuario = p_id_usuario
  ) registros
  WHERE registros.fecha_hora >= (NOW() - INTERVAL '3 months')
	ORDER BY registros.fecha_hora DESC
	LIMIT 30;
END;
$$ LANGUAGE plpgsql;


--
-- TRANSACCIÓN: REGISTRAR CÓDIGO DE VERIFICACIÓN
--
CREATE OR REPLACE FUNCTION registrar_codigo_verificacion(p_id_usuario INT, p_codigo VARCHAR(4))
RETURNS TABLE(
  codigo VARCHAR(4),
  fecha_hora_generacion TIMESTAMP,
  fecha_hora_vencimiento TIMESTAMP
) AS $$
BEGIN
	RETURN QUERY (
    WITH nuevo_registro AS (
      INSERT INTO codigos_verificacion (id_usuario, codigo, fecha_hora_generacion, fecha_hora_vencimiento)
      VALUES (p_id_usuario, p_codigo, NOW()::TIMESTAMP, (NOW() + interval '5 minutes')::TIMESTAMP)
      RETURNING codigos_verificacion.codigo, codigos_verificacion.fecha_hora_generacion, codigos_verificacion.fecha_hora_vencimiento
    )
    SELECT * FROM nuevo_registro
  );
END;
$$ LANGUAGE plpgsql;


--
-- TRANSACCIÓN: VALIDAR CÓDIGO DE VERIFICACIÓN
--
CREATE OR REPLACE FUNCTION validar_codigo_verificacion(p_id_usuario INT, p_codigo VARCHAR(4))
RETURNS BOOLEAN AS $$
DECLARE
  v_codigo INT;
BEGIN
	SELECT codigo
  FROM codigos_verificacion
  WHERE id_usuario = p_id_usuario AND fecha_hora_vencimiento >= NOW()
  ORDER BY fecha_hora_generacion DESC
  LIMIT 1
  INTO v_codigo;

  IF v_codigo IS NOT NULL THEN
    RETURN v_codigo = p_codigo;
  ELSE
    RETURN FALSE;
  END IF;
END;
$$ LANGUAGE plpgsql;