const { Rating, Device } = require("../models/models");
const ApiError = require("../error/ApiError");

class RatingController {
  async addRating(req, res, next) {
    try {
      const { userId, deviceId, rating } = req.body;

      await Rating.create({ userId, deviceId, rate: rating });
      const device = await Device.findOne({ where: { id: deviceId } });
      await Device.update(
        { rating: ((device.dataValues.rating + rating) / 2).toFixed(1) },
        { where: { id: deviceId } }
      );

      return res.json({ message: "Рейтинг добавлен и обновлен!" });
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }
}

module.exports = new RatingController();
