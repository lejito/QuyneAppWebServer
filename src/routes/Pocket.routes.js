const express = require("express")

const router = express.Router()

const { PocketController } = require('../controllers');
const _PocketController = new PocketController()

router.get("/by_account/:id", _PocketController.findAll);
router.get("/:id", _PocketController.findOne);
router.post("/", _PocketController.create);
router.put("/:id", _PocketController.update);
router.delete("/:id", _PocketController.delete);
module.exports = router