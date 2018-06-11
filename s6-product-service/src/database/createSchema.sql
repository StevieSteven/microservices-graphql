USE `ms-s6-products`;

DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;

CREATE TABLE IF NOT EXISTS categories (
	id			INTEGER PRIMARY KEY auto_increment,
    uuid 		VARCHAR(36),
    `name` 	VARCHAR(40)
);

CREATE TABLE IF NOT EXISTS products (
	id 			INTEGER PRIMARY KEY auto_increment,
    uuid		VARCHAR(36),
    `name`		VARCHAR(255),
    `description`	TEXT,
    price	FLOAT,
    category_id INTEGER,
	CONSTRAINT FK_CATEGORY_PRODUCTS FOREIGN KEY (category_id)
	REFERENCES categories(id)
);