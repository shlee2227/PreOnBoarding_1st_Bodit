-- migrate:up
ALTER TABLE `users` ADD `deleted` varchar(50) DEFAULT false;


-- migrate:down

