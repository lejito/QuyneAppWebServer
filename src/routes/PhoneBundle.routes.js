const express = require("express")

const router = express.Router()

const { PhoneBundleController } = require('../controllers');
const _PhoneBundleController = new PhoneBundleController()

router.post("/", _PhoneBundleController.create)

module.exports = router