const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const logger = require('morgan');
const cors = require('cors');
const multer = require('multer');
const admin = require('firebase-admin');
const serviceAcount = require('./serviceAccountKey.json');
const passport = require('passport');
const io = require('socket.io')(server);

const mercadopago = require('mercadopago');

/**
 * mercado pago
 */

mercadopago.configure({
  access_token: 'TEST-5651992968508280-122603-7f35626f62d7749655c1030cd1d27e48-74827549'
})

/*
 * Sockets
 */

const orderDeliverySocket = require('./sockets/orders_delivery_socket')


/*
 * Inicializar firebase admin
 */
admin.initializeApp({
  credential: admin.credential.cert(serviceAcount),
});

const upload = multer({
  storage: multer.memoryStorage(),
});
/**
 * Rutas
 */

const users = require('./routes/usersRoutes');
const categories = require('./routes/categoriesRoutes');
const products = require('./routes/productsRoutes');
const address = require('./routes/addressRoutes');
const orders = require('./routes/ordersRoutes');
const mercadoPago = require('./routes/mercadoPagoRoutes');

console.log(typeof orderDeliverySocket)
console.log(typeof users)

const port = process.env.PORT || 3000;

orderDeliverySocket(io);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.disable('x-powered-by');

app.set('port', port);

/**
 * Llamando a las rutas
 */
users(app, upload);
categories(app);
address(app);
products(app, upload);
orders(app);
mercadoPago(app);

server.listen(3000, '192.168.1.110' || 'localhost', function () {
  console.log('Applicacion de NodeJS ' + process.pid + ' Iniciada...');
});

app.get('/', (req, res) => {
  res.send('Ruta raiz');
});

//ERROR HANDLER

app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500).send(err.stack);
});

module.exports = {
  app,
  server,
};
