--- QUYNEAPPDB - GOOGLE DRIVE: https://drive.google.com/drive/folders/1N4EG9pGkzNvGnHF8qf4QDJdi2HwiepJt?usp=drive_link


--
-- VISTAS
--


-- MONTO PROMEDIO DE LOS MOVIMIENTOS DE LO QUE LLEVAMOS DEL AÑO 2023
CREATE VIEW monto_promedio_movimientos_2023 AS (
  SELECT AVG(monto) AS monto_promedio
  FROM movimientos
  WHERE fecha >= '2023-01-01' AND fecha <= '2023-12-31'
);


-- CANTIDAD DE MOVIMIENTOS REALIZADOS POR CADA CUENTA (DE MAYOR A MENOR)
CREATE VIEW cantidad_movimientos_por_cuenta AS (
  SELECT cuenta_origen AS id_cuenta, COUNT(*) AS cantidad_movimientos
  FROM movimientos  
  GROUP BY cuenta_origen
  ORDER BY cantidad_movimientos DESC
);


-- ÚLTIMOS 100 MOVIMIENTOS REALIZADOS (CON SU RESPECTIVO TIPO DE MOVIMIENTO)
CREATE VIEW ultimos_100_movimientos AS (
  SELECT * FROM (
    SELECT
    mov.id AS id_movimiento,
    'Transferencia interna'::VARCHAR(30) AS tipo_movimiento,
    mov.fecha_hora AS fecha_hora,
    mov.monto AS monto
    FROM movimientos mov
    INNER JOIN transferencias_internas ti ON ti.id_movimiento = mov.id
  
    UNION ALL
  
    SELECT
    mov.id AS id_movimiento,
    'Transferencia externa'::VARCHAR(30) AS tipo_movimiento,
    mov.fecha_hora AS fecha_hora,
    mov.monto AS monto
    FROM movimientos mov
    INNER JOIN transferencias_externas te ON te.id_movimiento = mov.id
  
    UNION ALL

    SELECT
    mov.id AS id_movimiento,
    'Pago factura'::VARCHAR(30) AS tipo_movimiento,
    mov.fecha_hora AS fecha_hora,
    mov.monto AS monto
    FROM movimientos mov
    INNER JOIN facturas ft ON ft.id_movimiento = mov.id
  
    UNION ALL
  
    SELECT
    mov.id AS id_movimiento,
    'Recarga cívica'::VARCHAR(30) AS tipo_movimiento,
    mov.fecha_hora AS fecha_hora,
    mov.monto AS monto
    FROM movimientos mov
    INNER JOIN recargas_civica rc ON rc.id_movimiento = mov.id
  
    UNION ALL
  
    SELECT
    mov.id AS id_movimiento,
    'Recarga telefonía'::VARCHAR(30) AS tipo_movimiento,
    mov.fecha_hora AS fecha_hora,
    mov.monto AS monto
    FROM movimientos mov
    INNER JOIN recargas_telefonia rt ON rt.id_movimiento = mov.id
  
    UNION ALL
  
    SELECT
    mov.id AS id_movimiento,
    'Paquete telefonía'::VARCHAR(30) AS tipo_movimiento,
    mov.fecha_hora AS fecha_hora,
    mov.monto AS monto
    FROM movimientos mov
    INNER JOIN paquetes_telefonia pt ON pt.id_movimiento = mov.id
  
    UNION ALL
  
    SELECT
    mov.id AS id_movimiento,
    'Recarga'::VARCHAR(30) AS tipo_movimiento,
    mov.fecha_hora AS fecha_hora,
    mov.monto AS monto
    FROM movimientos mov
    INNER JOIN recargas rc ON rc.id_movimiento = mov.id
  
    UNION ALL
  
    SELECT
    mov.id AS id_movimiento,
    'Retiro'::VARCHAR(30) AS tipo_movimiento,
    mov.fecha_hora AS fecha_hora,
    mov.monto AS monto
    FROM movimientos mov
    INNER JOIN retiros rt ON rt.id_movimiento = mov.id

    UNION ALL

    SELECT
    mov.id AS id_movimiento,
    'Carga a bolsillo'::VARCHAR(30) AS tipo_movimiento,
    mov.fecha_hora AS fecha_hora,
    mov.monto AS monto
    FROM movimientos mov
    INNER JOIN transferencias_bolsillos trb ON trb.id_movimiento = mov.id
    WHERE trb.tipo = 'Carga'

    UNION ALL

    SELECT
    mov.id AS id_movimiento,
    'Descarga desde bolsillo'::VARCHAR(30) AS tipo_movimiento,
    mov.fecha_hora AS fecha_hora,
    mov.monto AS monto
    FROM movimientos mov
    INNER JOIN transferencias_bolsillos trb ON trb.id_movimiento = mov.id
    WHERE trb.tipo = 'Descarga'
  ) movimientos
	ORDER BY movimientos.fecha_hora DESC
	LIMIT 100
);


-- CANTIDAD DE USUARIOS POR CADA TIPO DE DOCUMENTO (CC, TI, CE, PP) (DE MAYOR A MENOR)
CREATE VIEW cantidad_usuarios_por_tipo_documento AS (
  SELECT tipo_documento, COUNT(*) AS cantidad_usuarios
  FROM usuarios
  GROUP BY tipo_documento
  ORDER BY cantidad_usuarios DESC
);


-- CANTIDAD DE CUENTAS BLOQUEADAS Y DESBLOQUEADAS
CREATE VIEW cantidad_cuentas_bloqueadas_desbloqueadas AS (
  SELECT * FROM (
    SELECT 'Cuentas bloqueadas' AS etiqueta, COUNT(*) AS cantidad
    FROM cuentas
    WHERE habilitada = FALSE

    UNION ALL

    SELECT 'Cuentas desbloqueadas' AS etiqueta, COUNT(*) AS cantidad
    FROM cuentas
    WHERE habilitada = TRUE
  ) cuentas_bloqueadas_desbloqueadas
);


-- CANTIDAD DE COMPRAS DE RECARGAS Y PAQUETES POR CADA OPERADOR DE TELEFONÍA MÓVIL EN EL SEGUNDO SEMESTRE DE 2021 (DE MAYOR A MENOR)
CREATE VIEW cantidad_compras_por_operador_20212 AS (
  SELECT operador, COUNT(*) AS cantidad_compras FROM (
    SELECT mov.fecha, rt.operador
    FROM movimientos mov
    INNER JOIN recargas_telefonia rt ON rt.id_movimiento = mov.id
  
    UNION ALL
  
    SELECT mov.fecha, pt.operador
    FROM movimientos mov
    INNER JOIN paquetes_telefonia pt ON pt.id_movimiento = mov.id
  ) cantidad_compras
  WHERE fecha >= '2021-06-01' AND fecha <= '2021-12-31'
  GROUP BY operador
  ORDER BY cantidad_compras DESC
);


-- CANTIDAD TOTAL DE DINERO INVOLUCRADO EN MOVIMIENTOS DE CADA AÑO (DE FORMA DESCENDENTE EN EL TIEMPO)
CREATE VIEW cantidad_dinero_movimientos_por_periodo AS (
  SELECT EXTRACT(YEAR FROM fecha) AS periodo, SUM(monto) AS dinero_movimientos
  FROM movimientos
  GROUP BY periodo
  ORDER BY periodo ASC
);


-- VER EL MONTO MAYOR Y EL MONTO MENOR INVOLUCRADOS EN TRANSFERENCIAS EXTERNAS POR CADA ENTIDAD
CREATE VIEW monto_mayor_menor_por_entidad AS (
  SELECT tfe.entidad_destino AS entidad, MAX(mov.monto) AS monto_maximo, MIN(mov.monto) AS monto_minimo
  FROM movimientos mov
  INNER JOIN transferencias_externas tfe ON tfe.id_movimiento = mov.id
  GROUP BY tfe.entidad_destino
);