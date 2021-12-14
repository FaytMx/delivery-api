const Order = require('../models/order');
const OrderHasProducts = require('../models/order_has_products');

module.exports = {
  async findByStatus(req, res, next) {
    try {
      const status = req.params.status;

      const data = await Order.findByStatus(status);

      return res.status(201).json(data);
    } catch (error) {
      console.log('Error: ', error);
      return res.status(501).json({
        success: false,
        message: 'Hubo un error al obtener las ordenes',
        error: error,
      });
    }
  },

  async findByDeliveryAndStatus(req, res, next) {
    try {
      const id_delivery = req.params.id_delivery;
      const status = req.params.status;

      const data = await Order.findByDeliveryAndStatus(id_delivery, status);

      return res.status(201).json(data);
    } catch (error) {
      console.log('Error: ', error);
      return res.status(501).json({
        success: false,
        message: 'Hubo un error al obtener las ordenes',
        error: error,
      });
    }
  },

  async create(req, res, next) {
    try {
      let order = req.body;
      order.status = 'PAGADO';
      const data = await Order.create(order);

      for (const product of order.products) {
        await OrderHasProducts.create(data.id, product.id, product.quantity);
      }
      return res.status(201).json({
        success: true,
        message: 'La orden se creo correctamente',
        data: data.id,
      });
    } catch (error) {
      console.log(error);
      return res.status(501).json({
        success: false,
        message: 'Hubo un error al crear una orden',
        error: error,
      });
    }
  },

  async updateToDispatch(req, res, next) {
    try {
      let order = req.body;
      order.status = 'DESPACHADO';
      await Order.update(order);

      return res.status(201).json({
        success: true,
        message: 'La orden se actualizo correctamente',
      });
    } catch (error) {
      console.log(error);
      return res.status(501).json({
        success: false,
        message: 'Hubo un error al actualizar una orden',
        error: error,
      });
    }
  },

  async updateToOnTheWay(req, res, next) {
    try {
      let order = req.body;
      order.status = 'EN CAMINO';
      await Order.update(order);

      return res.status(201).json({
        success: true,
        message: 'La orden se actualizo correctamente',
      });
    } catch (error) {
      console.log(error);
      return res.status(501).json({
        success: false,
        message: 'Hubo un error al actualizar una orden',
        error: error,
      });
    }
  },
};
