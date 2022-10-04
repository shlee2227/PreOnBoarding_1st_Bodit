-- migrate:up

CREATE TABLE `data_types` (	
`id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,	
`name` varchar(50)	
);	

-- migrate:down

DROP TABLE data_types;
