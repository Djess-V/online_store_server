const Router = require("express");
const router = new Router();
const userRouter = require("./userRouter");
const deviceRouter = require("./deviceRouter");
const typeRouter = require("./typeRouter");
const brandRouter = require("./brandRouter");
const basketRouter = require("./basketRouter");
const pendingPurchaseRouter = require("./pendingPurchaseRouter");
const orderRouter = require("./orderRouter");
const ratingRouter = require("./ratingRouter");

router.use("/user", userRouter);
router.use("/device", deviceRouter);
router.use("/type", typeRouter);
router.use("/brand", brandRouter);
router.use("/basket", basketRouter);
router.use("/pending_purchase", pendingPurchaseRouter);
router.use("/order", orderRouter);
router.use("/rating", ratingRouter);

module.exports = router;
