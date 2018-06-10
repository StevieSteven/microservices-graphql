USE `ms-s7-order`;

DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;

DROP TABLE IF EXISTS shoppingcart_items;
DROP TABLE IF EXISTS shoppingcarts;

CREATE TABLE IF NOT EXISTS orders (
	id			INTEGER PRIMARY KEY auto_increment,
    uuid 		VARCHAR(36),
    `timestamp` 	VARCHAR(40),
    customer_uuid VARCHAR(36),
    `status` ENUM('ORDER_PLACED', 'PROCESSING', 'SHIPPED', 'COMPLETED')
);

CREATE TABLE IF NOT EXISTS order_items (
	id 			INTEGER PRIMARY KEY auto_increment,
    uuid		VARCHAR(36),
	quantity INTEGER,
    product_uuid VARCHAR(36),
    order_id INTEGER,
	CONSTRAINT FK_ORDERS_ORDERITEMS FOREIGN KEY (order_id)
	REFERENCES orders(id)
);

CREATE TABLE IF NOT EXISTS shoppingcarts (
	id			INTEGER PRIMARY KEY auto_increment,
    uuid 		VARCHAR(36),
    customer_uuid VARCHAR(36)
);

CREATE TABLE IF NOT EXISTS shoppingcart_items (
	id 			INTEGER PRIMARY KEY auto_increment,
    uuid		VARCHAR(36),
	quantity INTEGER,
    product_uuid VARCHAR(36),
    shoppingcart_id INTEGER,
	CONSTRAINT FK_SHOPPINGCART_SHOPPINGCARTITEMS FOREIGN KEY (shoppingcart_id)
	REFERENCES shoppingcarts(id)
);