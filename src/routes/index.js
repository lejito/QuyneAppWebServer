const express = require("express");
const UserRouter = require('./User.routes');
const AccountRouter = require('./Account.routes');

const router = express.Router();

router.use("/users", UserRouter);
router.use("/accounts", AccountRouter);

module.exports = router;
