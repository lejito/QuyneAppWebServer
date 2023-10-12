const express = require("express")

const router = express.Router()

const { PhoneRechargeController } = require('../controllers');
const _PhoneRechargeController = new PhoneRechargeController()

router.post("/", _PhoneRechargeController.create)

module.exports = router