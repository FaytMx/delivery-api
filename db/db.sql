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