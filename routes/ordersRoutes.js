const OrdersController = require('../controllers/ordersController');
const passport = require('passport');

module.exports = (app) => {
  app.get(
    '/api/orders/findByStatus/:status',
    passport.authenticate('jwt', { session: false }),
    OrdersController.findByStatus
  );

  app.get(
    '/api/orders/findByDeliveryAndStatus/:id_delivery/:status',
    passport.authenticate('jwt', { session: false }),
    OrdersController.findByDeliveryAndStatus
  );

  app.get(
    '/api/orders/findByClientAndStatus/:id_client/:status',
    passport.authenticate('jwt', { session: false }),
    OrdersController.findByClientAndStatus
  );

  app.post(
    '/api/orders/create',
    passport.authenticate('jwt', { session: false }),
    OrdersController.create
  );

  app.put(
    '/api/orders/updateToDispatch',
    passport.authenticate('jwt', { session: false }),
    OrdersController.updateToDispatch
  );

  app.put(
    '/api/orders/updateToOnTheWay',
    passport.authenticate('jwt', { session: false }),
    OrdersController.updateToOnTheWay
  );

  app.put(
    '/api/orders/updateToDelivery',
    passport.authenticate('jwt', { session: false }),
    OrdersController.updateToDelivery
  );

  
  app.put(
    '/api/orders/updateLatLng',
    passport.authenticate('jwt', { session: false }),
    OrdersController.updateLatLng
  );
};
