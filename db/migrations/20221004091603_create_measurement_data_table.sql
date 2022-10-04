-- migrate:up

CREATE TABLE `measurement_data` (	
`id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,	
`measurement_id` INT NOT NULL,	
`data_type_id` INT NOT NULL,	
`data` INT,	
FOREIGN KEY (measurement_id) REFERENCES measurements (id),	
FOREIGN KEY (data_type_id) REFERENCES data_types (id)	
);	
	
-- migrate:down

DROP TABLE measurement_data;
