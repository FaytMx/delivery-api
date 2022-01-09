const mercadopago = require('mercadopago');
const { token } = require('morgan');

const Order = require('../models/order');
const OrderHasProducts = require('../models/order_has_products');
const User = require('../models/user');

mercadopago.configure({
  sandbox: true,
  access_token: 'TEST-5651992968508280-122603-7f35626f62d7749655c1030cd1d27e48-74827549',
});

module.exports = {
  async createPaymentCreditCard(req, res, next) {
    let payment = req.body;

    const payment_data = {
      description: payment.description,
      transaction_amount: payment.transaction_amount,
      installments: payment.installments,
      payment_method_id: payment.payment_method_id,
      token: payment.token,
      issuer_id:payment.issuer_id,
      payer: {
        email: payment.payer.email,
      },
    };

    const data = await mercadopago.payment.create(payment_data).catch((err) => {
      console.log(err);

      return res.status(501).json({
        success: false,
        message: 'Error al crear el pago',
        error: err,
      });
    });

    if (data) {
      console.log('DATOS PAGO: ', data);

      if (data != undefined) {
        const payment_type_id = module.exports.validatePaymentMethod(payment.payment_type_id);
        payment.id_payment_method = payment_type_id;

        let order = payment.order;
        order.status = 'PAGADO';
        const dataOrder = await Order.create(order);

        for (const product of order.products) {
          await OrderHasProducts.create(dataOrder.id, product.id, product.quantity);
        }
        return res.status(201).json(data.response);
      }
    }else {
      return res.status(501).json({
        success: false,
        message: 'Error, algun dato esta mal en la peticion',
      });
    }
  },

  validatePaymentMethod(status) {
    if (status == 'credit_card') {
      status = 1;
    }

    if (status == 'bank_transfer') {
      status = 2;
    }

    if (status == 'ticket') {
      status = 3;
    }

    if (status == 'upon_delivery') {
      status = 4;
    }

    return status;
  },
};
