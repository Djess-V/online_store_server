const Router = require("express");
const deviceController = require("../controllers/deviceController");
const router = new Router();
const checkRole = require("../middleware/checkRoleMiddleware");

router.post("/", checkRole("ADMIN"), deviceController.create);
router.get("/", deviceController.getAll);
router.get("/:id", deviceController.getOne);
router.delete("/", deviceController.delete);

module.exports = router;
