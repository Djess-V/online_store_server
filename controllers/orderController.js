const {
  Order,
  BasketDevice,
  OrderRecords,
  Device,
  Brand,
} = require("../models/models");
const ApiError = require("../error/ApiError");

class OrderController {
  async getOrders(req, res, next) {
    try {
      const { userId } = req.query;

      let orders = await Order.findAll({ where: { userId } });

      if (!orders) {
        return res.json({ message: "Заказы отсутствуют!" });
      }

      let orderRecords = {};
      for (let order of orders) {
        const recordsFound = await OrderRecords.findAll({
          where: { orderId: order.id },
        });

        let records = [];
        for (let record of recordsFound) {
          const { name, img, brandId } = await Device.findOne({
            where: { id: record.deviceId },
          });

          const { name: brandName } = await Brand.findOne({
            where: { id: brandId },
          });

          records.push({
            deviceId: record.deviceId,
            name,
            brandName,
            img,
            count: record.count,
            price: record.price,
            sum: record.sum,
          });
        }

        records = JSON.stringify(records);
        orderRecords[order.id] = records;
      }

      orders = JSON.stringify(orders);

      return res.json({ orders, orderRecords, message: "Заказы получены!" });
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async addOrder(req, res, next) {
    try {
      const { userId, basketId } = req.body;

      const order = await Order.create({
        userId,
      });

      const basketDevices = await BasketDevice.findAll({ where: { basketId } });

      let orderRecords = [];
      for (let device of basketDevices) {
        const orderRecord = await OrderRecords.create({
          userId,
          orderId: order.id,
          deviceId: device.deviceId,
          count: device.count,
          price: device.price,
          sum: device.count * device.price,
        });

        const { name, img, brandId } = await Device.findOne({
          where: { id: device.deviceId },
        });

        const { name: brandName } = await Brand.findOne({
          where: { id: brandId },
        });

        orderRecords.push({
          deviceId: orderRecord.deviceId,
          name,
          brandName,
          img,
          count: orderRecord.count,
          price: orderRecord.price,
          sum: orderRecord.sum,
        });
      }

      orderRecords = JSON.stringify(orderRecords);

      return res.json({ order, orderRecords, message: "Заказ создан!" });
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }
}

module.exports = new OrderController();
