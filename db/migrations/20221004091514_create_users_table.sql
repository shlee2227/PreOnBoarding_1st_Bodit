-- migrate:up

CREATE TABLE `users` (	
`id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,	
`name` varchar(50),	
`birth` varchar(50),	
`height` decimal(4,1),	
`phone` varchar(50)	
);	

-- migrate:down

DROP TABLE users;