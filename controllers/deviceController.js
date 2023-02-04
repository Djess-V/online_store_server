const uuid = require("uuid");
const path = require("path");
const fs = require("fs");
const { Device, DeviceInfo } = require("../models/models");
const ApiError = require("../error/ApiError");

class DeviceController {
  async create(req, res, next) {
    try {
      let { name, price, brandId, typeId, info } = req.body;
      const { img, description } = req.files;

      let imgFileName;
      if (img.mimetype === "image/webp") {
        imgFileName = uuid.v4() + ".webp";
      } else {
        imgFileName = uuid.v4() + ".jpg";
      }

      const descFileName = uuid.v4() + ".txt";

      img.mv(path.resolve(__dirname, "..", "static", imgFileName));
      description.mv(
        path.resolve(__dirname, "..", "static/description", descFileName)
      );
      const device = await Device.create({
        name,
        price,
        brandId,
        typeId,
        img: imgFileName,
        description: descFileName,
      });

      if (info) {
        info = JSON.parse(info);
        info.forEach((i) => {
          DeviceInfo.create({
            title: i.title,
            description: i.description,
            deviceId: device.id,
          });
        });
      }

      return res.json(device);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async getAll(req, res) {
    try {
      let { brandId, typeId, limit, page } = req.query;
      page = page || 1;
      limit = limit || 9;
      let offset = page * limit - limit;
      let devices;
      if (!brandId && !typeId) {
        devices = await Device.findAndCountAll({
          limit,
          offset,
          include: [{ model: DeviceInfo, as: "info" }],
        });
      }
      if (brandId && !typeId) {
        devices = await Device.findAndCountAll({
          where: { brandId },
          include: [{ model: DeviceInfo, as: "info" }],
          limit,
          offset,
        });
      }
      if (!brandId && typeId) {
        devices = await Device.findAndCountAll({
          where: { typeId },
          include: [{ model: DeviceInfo, as: "info" }],
          limit,
          offset,
        });
      }
      if (brandId && typeId) {
        devices = await Device.findAndCountAll({
          where: { brandId, typeId },
          include: [{ model: DeviceInfo, as: "info" }],
          limit,
          offset,
        });
      }

      for (let device of devices.rows) {
        const content = fs.readFileSync(
          path.resolve(
            __dirname,
            "..",
            "static/description",
            device.dataValues.description
          ),
          "utf-8"
        );

        device.dataValues.description = content;
      }

      return res.json(devices);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async getOne(req, res) {
    const { id } = req.params;

    const device = await Device.findOne({
      where: { id },
      include: [{ model: DeviceInfo, as: "info" }],
    });

    return res.json(device);
  }

  async delete(req, res, next) {
    const { id, name } = req.query;
    let device;

    if (!name && !id) {
      return next(ApiError.badRequest("Некорректный id или название!"));
    }

    if (name) {
      device = await Device.findOne({
        where: { name },
      });
    } else if (!name && id) {
      device = await Device.findOne({
        where: { id },
      });
    }

    const fileName = device.dataValues.img;

    fs.unlink(
      path.resolve(__dirname, "..", "static", fileName),
      function (err) {
        if (err) {
          return next(ApiError.badRequest("Файл img не найден!"));
        } else {
          console.log("Файл удалён");
        }
      }
    );

    if (name) {
      device = await Device.destroy({ where: { name } });
    } else if (!name && id) {
      device = await Device.destroy({ where: { id } });
    }

    return res.json({ device });
  }
}

module.exports = new DeviceController();
