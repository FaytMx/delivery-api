const AddressController = require('../controllers/addressController');
const passport = require('passport');

module.exports = (app) => {

  app.get( '/api/address/findByUser/:id_user', passport.authenticate('jwt', { session: false }), AddressController.findByUSer);

  app.post(
    '/api/address/create',
    passport.authenticate('jwt', { session: false }),
    AddressController.create
  );
};
