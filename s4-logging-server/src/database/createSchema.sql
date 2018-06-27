USE `ms-s4-logging`;

DROP TABLE IF EXISTS `logs`;

CREATE TABLE IF NOT EXISTS `logs` (
	id INTEGER primary key auto_increment,
    uuid VARCHAR(36),
    request_session VARCHAR(36),
    `timestamp` VARCHAR(40),
    service_id VARCHAR(40),
    `level` ENUM('debug', 'info', 'warn', 'error'),
    message LONGTEXT
);