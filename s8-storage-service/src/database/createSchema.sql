USE `ms-s8-storage`;

DROP TABLE IF EXISTS places;

CREATE TABLE IF NOT EXISTS places (
	id			INTEGER PRIMARY KEY auto_increment,
    uuid 		VARCHAR(36),
    `quantity` 	INTEGER ,
    product_uuid VARCHAR(36)
);

