-- migrate:up

CREATE TABLE `measurements` (	
`id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,	
`user_id` INT NOT NULL,	
`weight` decimal(4,1) NOT NULL,	
`created_at` TIMESTAMP NOT NULL DEFAULT NOW(),	
FOREIGN KEY (user_id) REFERENCES users (id)	
);	

-- migrate:down

DROP TABLE measurements;
