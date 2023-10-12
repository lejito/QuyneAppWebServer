const express = require("express")

const router = express.Router()

const { PocketTransactionController } = require('../controllers');
const _PocketTransactionController = new PocketTransactionController()

router.get("/:id", _PocketTransactionController.findAllByPocket);

module.exports = router

