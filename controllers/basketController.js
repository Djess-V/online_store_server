const { BasketDevice } = require("../models/models");
const ApiError = require("../error/ApiError");

class BasketController {
  async getBasketDevices(req, res, next) {
    try {
      const { basketId } = req.query;

      const devices = await BasketDevice.findAll({ where: { basketId } });

      return res.json({ devices });
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async addBasketDevice(req, res, next) {
    try {
      const { basketId, deviceId, price, count } = req.body;

      if (count) {
        await BasketDevice.create({
          basketId,
          deviceId,
          price,
          count,
        });
      } else {
        await BasketDevice.create({
          basketId,
          deviceId,
          price,
        });
      }

      return res.json({ message: "Устройство добавлено  в базу!" });
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async updateBasketDevice(req, res, next) {
    try {
      const { basketId, deviceId, field } = req.body;

      if (field.name === "count") {
        if (field.action === "up") {
          await BasketDevice.increment(field.name, {
            where: { basketId, deviceId },
          });

          return res.json({ message: "Значение count увеличено!" });
        } else {
          await BasketDevice.decrement(field.name, {
            where: { basketId, deviceId },
          });

          return res.json({ message: "Значение count уменьшено!" });
        }
      }
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async deleteBasketDevice(req, res, next) {
    try {
      const { basketId, deviceId } = req.query;

      if (!basketId) {
        next(ApiError.badRequest("Данные basketId заданы некорректно!"));
      }

      await BasketDevice.destroy({
        where: { basketId, deviceId },
      });

      return res.json({ message: "Устройство удалено из базы!" });
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }

  async getBasketDevice(req, res, next) {
    try {
      const { basketId } = req.query;
      const { id } = req.params;

      const device = await BasketDevice.findOne({
        where: { basketId, deviceId: id },
      });

      return res.json({ device });
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }
}

module.exports = new BasketController();
