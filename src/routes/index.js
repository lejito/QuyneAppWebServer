const express = require("express");
const router = express.Router();

const usuariosRouter = require("./usuarios.router");
const cuentasRouter = require("./cuentas.router");
const movimientosRouter = require("./movimientos.router");
const bolsillosRouter = require("./bolsillos.router");

router.use("/usuarios", usuariosRouter);
router.use("/cuentas", cuentasRouter);
router.use("/movimientos", movimientosRouter);
router.use("/bolsillos", bolsillosRouter);

module.exports = router;
