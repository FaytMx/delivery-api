DROP TABLE IF EXISTS roles CASCADE;
CREATE TABLE roles(
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    image VARCHAR(255) NULL,
    route VARCHAR(255) NULL,
    created_at timestamp NOT NULL,
    updated_at timestamp NOT NULL
);
INSERT INTO roles(name, route, created_at, updated_at)
VALUES (
        'CLIENTE',
        'client/products/list',
        '2021-09-24',
        '2021-09-24'
    ),
    (
        'RESTAURANTE',
        'restaurant/orders/list',
        '2021-09-24',
        '2021-09-24'
    ),
    (
        'REPARTIDOR',
        'delivery/orders/list',
        '2021-09-24',
        '2021-09-24'
    );
DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users(
    id BIGSERIAL PRIMARY KEY,
    email varchar(255) NOT NULL UNIQUE,
    name varchar(255) NOT NULL,
    lastname varchar(255) NOT NULL,
    phone varchar(80) NOT NULL UNIQUE,
    image varchar(255) NULL,
    PASSWORD varchar(255) NOT NULL,
    is_available boolean NULL,
    session_token varchar(255) NULL,
    created_at timestamp NOT NULL,
    updated_at timestamp NOT NULL
);
DROP TABLE IF EXISTS user_has_roles CASCADE;
CREATE TABLE user_has_roles(
    id_user BIGSERIAL NOT NULL,
    id_rol BIGSERIAL NOT NULL,
    created_at timestamp NOT NULL,
    updated_at timestamp NOT NULL,
    FOREIGN KEY(id_user) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY(id_user) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    PRIMARY KEY (id_user, id_rol)
);
DROP TABLE IF EXISTS categories CASCADE;
CREATE TABLE categories(
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(180) NOT NULL UNIQUE,
    description VARCHAR(255) NOT NULL,
    created_at timestamp NOT NULL,
    updated_at timestamp NOT NULL
);
DROP TABLE IF EXISTS products CASCADE;
CREATE TABLE products(
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(180) NOT NULL UNIQUE,
    description VARCHAR(255) NOT NULL,
    price DECIMAL DEFAULT 0,
    image1 VARCHAR(255) NOT NULL,
    image2 VARCHAR(255) NULL,
    image3 VARCHAR(255) NULL,
    id_category BIGINT NOT NULL,
    created_at timestamp NOT NULL,
    updated_at timestamp NOT NULL,
    FOREIGN KEY(id_category) REFERENCES categories(id) ON UPDATE CASCADE ON DELETE CASCADE
);
DROP TABLE IF EXISTS address CASCADE;
CREATE TABLE address(
    id BIGSERIAL PRIMARY KEY,
    id_user BigInt NOT NULL,
    address VARCHAR(255) NOT NULL,
    neighborhood VARCHAR(255) NOT NULL,
    lat DECIMAL DEFAULT 0,
    lng DECIMAL DEFAULT 0,
    created_at timestamp NOT NULL,
    updated_at timestamp NOT NULL,
    FOREIGN KEY(id_user) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
);
DROP TABLE IF EXISTS orders CASCADE;
CREATE TABLE orders(
    id BIGSERIAL PRIMARY KEY,
    id_client BigInt NOT NULL,
    id_delivery BigInt NULL,
    id_address BigInt NOT NULL,
    lat DECIMAL DEFAULT 0,
    lng DECIMAL DEFAULT 0,
    status VARCHAR(90) NOT NULL,
    timestamp BIGINT NOT NULL,
    created_at timestamp NOT NULL,
    updated_at timestamp NOT NULL,
    FOREIGN KEY(id_client) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY(id_delivery) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY(id_address) REFERENCES address(id) ON UPDATE CASCADE ON DELETE CASCADE
);
DROP TABLE IF EXISTS order_has_products CASCADE;
CREATE TABLE order_has_products(
    PRIMARY KEY(id_order, id_product),
    id_order BigInt NOT NULL,
    id_product BigInt NOT NULL,
    quantity BigInt NOT NULL,
    created_at timestamp NOT NULL,
    updated_at timestamp NOT NULL,
    FOREIGN KEY(id_order) REFERENCES orders(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY(id_product) REFERENCES products(id) ON UPDATE CASCADE ON DELETE CASCADE
);
INSERT INTO users (
        email,
        name,
        lastname,
        phone,
        PASSWORD,
        created_at,
        updated_at
    )
VALUES (
        'silverzero55@gmail.com',
        'Emanuel',
        'Vargas',
        '5525222989',
        '1234567',
        NOW(),
        NOW()
    );
SELECT P.id,
    P.name,
    P.description,
    P.price,
    P.image1,
    P.image2,
    P.image3,
    P.id_category
FROM products as P
    INNER JOIN categories as C ON p.id_category = c.id
where C.id = 1;
SELECT O.id,
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
WHERE O.status = 'DESPACHADO'
GROUP BY O.id,
    U.id,
    U2.id,
    A.id