const { PendingPurchase } = require("../models/models");
const ApiError = require("../error/ApiError");

class ExitController {
  async addPendingPurchase(req, res, next) {
    try {
      const { userId, deviceIds } = req.body;

      const pendingPurchase = await PendingPurchase.create({
        userId,
        devices: deviceIds,
      });

      return res.json({
        pendingPurchase,
        message: "Незавершённые покупки сохранены!",
      });
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }
}

module.exports = new ExitController();
