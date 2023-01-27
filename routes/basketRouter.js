const Router = require("express");
const basketController = require("../controllers/basketController");
const router = new Router();

router.get("/", basketController.getBasketDevices);
router.post("/", basketController.addBasketDevice);
router.put("/", basketController.updateBasketDevice);
router.delete("/", basketController.deleteBasketDevice);
router.get("/:id", basketController.getBasketDevice);

module.exports = router;
