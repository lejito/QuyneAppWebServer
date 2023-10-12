const express = require("express");
const UserRouter = require('./User.routes');
const AccountRouter = require('./Account.routes');
const TransactionRouter = require('./Transaction.routes');
const PokectRouter = require("./Pocket.routes");
const InternalTransactionRouter = require("./InternalTransaction.routes")
const ExternalTransactionRouter = require("./ExternalTransaction.routes")
const BillRouter = require('./Bill.routes');
const ReloadCivicaRouter = require('./ReloadCivica.routes');
const router = express.Router();

router.use("/users", UserRouter);
router.use("/accounts", AccountRouter);
router.use("/transactions", TransactionRouter);
router.use("/pockets", PokectRouter);
router.use("/internal_transactions", InternalTransactionRouter);
router.use("/external_transactions", ExternalTransactionRouter);
router.use("/bills", BillRouter);
router.use("/reload_civica", ReloadCivicaRouter);
module.exports = router;
