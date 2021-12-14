const db = require('../config/config');

const Order = {};

Order.findByStatus = (status) => {
  const sql = `SELECT O.id,
              O.id_client,
              O.id_address,
              O.id_delivery,
              O.status,
              O.timestamp,
              JSON_AGG(
                  JSON_BUILD_OBJECT(
                      'id',
                      P.id,
                      'name',
                      P.name,
                      'description',
                      P.description,
                      'price',
                      P.price,
                      'image1',
                      P.image1,
                      'image2',
                      P.image2,
                      'image3',
                      P.image3,
                      'quantity',
                      OHP.quantity
                  )
              ) as products,
              JSON_BUILD_OBJECT(
                  'id',
                  U.id,
                  'name',
                  U.name,
                  'lastname',
                  U.lastname,
                  'image',
                  U.image
              ) as client,
              JSON_BUILD_OBJECT(
                  'id',
                  U2.id,
                  'name',
                  U2.name,
                  'lastname',
                  U2.lastname,
                  'image',
                  U2.image
              ) as delivery,
              JSON_BUILD_OBJECT(
                  'id',
                  A.id,
                  'address',
                  A.address,
                  'neighborhood',
                  A.neighborhood,
                  'lat',
                  A.lat,
                  'lng',
                  A.lng
              ) as address
            FROM orders AS O
              INNER JOIN users as U ON O.id_client = U.id
              LEFT JOIN users as U2 ON O.id_delivery = U2.id
              INNER JOIN address as A ON A.id = O.id_address
              INNER join order_has_products as OHP ON OHP.id_order = O.id
              INNER join products as P ON P.id = OHP.id_product
            WHERE O.status = $1
            GROUP BY O.id,
              U.id,
              U2.id,
              A.id
    `;

  return db.manyOrNone(sql, [status]);
};

Order.findByDeliveryAndStatus = (id_delivery,status) => {
  const sql = `SELECT O.id,
              O.id_client,
              O.id_address,
              O.id_delivery,
              O.status,
              O.timestamp,
              JSON_AGG(
                  JSON_BUILD_OBJECT(
                      'id',
                      P.id,
                      'name',
                      P.name,
                      'description',
                      P.description,
                      'price',
                      P.price,
                      'image1',
                      P.image1,
                      'image2',
                      P.image2,
                      'image3',
                      P.image3,
                      'quantity',
                      OHP.quantity
                  )
              ) as products,
              JSON_BUILD_OBJECT(
                  'id',
                  U.id,
                  'name',
                  U.name,
                  'lastname',
                  U.lastname,
                  'image',
                  U.image
              ) as client,
              JSON_BUILD_OBJECT(
                  'id',
                  U2.id,
                  'name',
                  U2.name,
                  'lastname',
                  U2.lastname,
                  'image',
                  U2.image
              ) as delivery,
              JSON_BUILD_OBJECT(
                  'id',
                  A.id,
                  'address',
                  A.address,
                  'neighborhood',
                  A.neighborhood,
                  'lat',
                  A.lat,
                  'lng',
                  A.lng
              ) as address
            FROM orders AS O
              INNER JOIN users as U ON O.id_client = U.id
              LEFT JOIN users as U2 ON O.id_delivery = U2.id
              INNER JOIN address as A ON A.id = O.id_address
              INNER join order_has_products as OHP ON OHP.id_order = O.id
              INNER join products as P ON P.id = OHP.id_product
            WHERE O.id_delivery = $1 AND O.status = $2 
            GROUP BY O.id,
              U.id,
              U2.id,
              A.id
    `;

  return db.manyOrNone(sql, [id_delivery, status]);
};

Order.create = (order) => {
  console.log(order);
  const sql = `INSERT INTO orders(id_client, id_address, status, timestamp, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`;

  return db.oneOrNone(sql, [
    order.id_client,
    order.id_address,
    order.status,
    Date.now(),
    new Date(),
    new Date(),
  ]);
};

Order.update = (order) => {
  const sql = `UPDATE orders SET id_client = $2, id_address = $3, id_delivery = $4, status = $5, updated_at = $6 WHERE id = $1`;

  return db.none(sql, [
    order.id,
    order.id_client,
    order.id_address,
    order.id_delivery,
    order.status,
    new Date(),
  ]);
};

module.exports = Order;
