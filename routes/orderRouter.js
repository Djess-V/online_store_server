const Router = require("express");
const orderController = require("../controllers/orderController");
const router = new Router();

router.get("/", orderController.getOrders);
router.post("/", orderController.addOrder);

module.exports = router;
