USE `ms-s11-ratings`;

DROP TABLE IF EXISTS ratings;

CREATE TABLE IF NOT EXISTS ratings (
	id			INTEGER PRIMARY KEY auto_increment,
    uuid 		VARCHAR(36),
    `timestamp` 	VARCHAR(200),
    customer_uuid VARCHAR(36),
    product_uuid VARCHAR(36),
    stars TINYINT UNSIGNED,
    `comment` TEXT
);
