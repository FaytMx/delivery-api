const Category = require('../models/category');
const { create, getAll } = require('../models/user');

module.exports = {
  async getAll(req, res, next) {
    try {
      const data = await Category.getAll();

      console.log('Categories', data);
      return res.status(201).json(data);
    } catch (error) {
      console.log('Error: ', error);
      return res.status(501).json({
        success: false,
        message: 'Hubo un error al obtener las categorias',
        error: error,
      });
    }
  },

  async create(req, res, next) {
    try {
      const category = req.body;
      console.log('Category: ', category);

      const data = await Category.create(category);

      return res.status(201).json({
        success: true,
        message: 'Categoria creada',
        data: data.id,
      });
    } catch (error) {
      console.log('Error: ', error);
      return res.status(501).json({
        success: false,
        message: 'Hubo un error al crear la categoria',
        error: error,
      });
    }
  },
};
