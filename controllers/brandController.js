const { Brand } = require("../models/models");
const ApiError = require("../error/ApiError");

class BrandController {
  async create(req, res, next) {
    const { name } = req.body;
    if (!name) {
      return next(ApiError.badRequest("Поле name не задано!"));
    }
    const brand = await Brand.create({ name });
    res.json(brand);
  }

  async getAll(req, res) {
    const brands = await Brand.findAll();
    return res.json(brands);
  }

  async delete(req, res, next) {
    const { id, name } = req.query;
    let brand;
    if (name) {
      brand = await Brand.destroy({ where: { name } });
    } else if (!name && id) {
      brand = await Brand.destroy({ where: { id } });
    } else if (!name && !id) {
      return next(ApiError.badRequest("Некорректный id или название!"));
    }

    return res.json({ brand });
  }
}

module.exports = new BrandController();
