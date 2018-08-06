USE `ms-s5-customer`;

DROP TABLE IF EXISTS addresses;
DROP TABLE IF EXISTS customers;

CREATE TABLE IF NOT EXISTS customers (
	id			INTEGER PRIMARY KEY auto_increment,
    uuid 		VARCHAR(36),
    firstName 	VARCHAR(40),
    surname		VARCHAR(40),
    email		VARCHAR(40),
    gender		ENUM('MALE', 'FEMALE', 'OTHER')
);

CREATE TABLE IF NOT EXISTS addresses (
	id 			INTEGER PRIMARY KEY auto_increment,
    uuid		VARCHAR(36),
    street		VARCHAR(255),
    `number`	VARCHAR(10),
    postal_code	VARCHAR(10),
    city		VARCHAR(40),
    country		VARCHAR(255),
    customer_id INTEGER,
	CONSTRAINT FK_CUSTOMERS_ADRESSES FOREIGN KEY (customer_id)
	REFERENCES customers(id)
);