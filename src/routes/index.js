const express = require("express");
const router = express.Router();

const usuariosRouter = require("./usuarios.router");
const cuentasRouter = require("./cuentas.router");
const movimientosRouter = require("./movimientos.router");

router.use("/usuarios", usuariosRouter);
router.use("/cuentas", cuentasRouter);
router.use("/movimientos", movimientosRouter);

module.exports = router;
