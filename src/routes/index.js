const express = require("express");
const UserRouter = require('./User.routes');
const AccountRouter = require('./Account.routes');
const TransactionRouter = require('./Transaction.routes');
const router = express.Router();

router.use("/users", UserRouter);
router.use("/accounts", AccountRouter);
router.use("/transactions", TransactionRouter);

module.exports = router;
