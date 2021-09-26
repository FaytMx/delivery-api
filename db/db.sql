DROP TABLE IF EXISTS roles CASCADE;

CREATE TABLE roles(
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    image VARCHAR(255) NULL,
    route VARCHAR(255) NULL,
    created_at timestamp NOT NULL,
    updated_at timestamp NOT NULL
);

INSERT INTO
    roles(name, route, created_at, updated_at)
VALUES
    (
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

INSERT INTO
    users (
        email,
        name,
        lastname,
        phone,
        PASSWORD,
        created_at,
        updated_at
    )
VALUES
    (
        'silverzero55@gmail.com',
        'Emanuel',
        'Vargas',
        '5525222989',
        '1234567',
        NOW(),
        NOW()
    );