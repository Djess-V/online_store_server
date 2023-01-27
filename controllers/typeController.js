const { Type } = require("../models/models");
const ApiError = require("../error/ApiError");

class TypeController {
  async create(req, res) {
    const { name } = req.body;
    const type = await Type.create({ name });
    res.json(type);
  }

  async getAll(req, res) {
    const types = await Type.findAll();
    return res.json(types);
  }

  async delete(req, res, next) {
    const { id, name } = req.query;
    let type;
    if (name) {
      type = await Type.destroy({ where: { name } });
    } else if (!name && id) {
      type = await Type.destroy({ where: { id } });
    } else if (!name && !id) {
      return next(ApiError.badRequest("Некорректный id или название!"));
    }

    return res.json({ type });
  }
}

module.exports = new TypeController();
