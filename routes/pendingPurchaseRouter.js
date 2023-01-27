const Router = require("express");
const pendingPurchaseController = require("../controllers/pendingPurchaseController");
const router = new Router();

router.post("/", pendingPurchaseController.addPendingPurchase);

module.exports = router;
