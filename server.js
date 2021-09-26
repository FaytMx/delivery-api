const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const logger = require('morgan');
const cors = require('cors');

/**
 * Rutas
 */

const users = require('./routes/usersRoutes');

const port = process.env.PORT || 3000;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.disable('x-powered-by');

app.set('port', port);

/**
 * Llamando a las rutas
 */
users(app);

server.listen(3000, '192.168.0.36' || 'localhost', function () {
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
