const express = require("express");
const UserRouter = require('./User.routes');
const router = express.Router();

router.use("/users", UserRouter)

module.exports = router;
