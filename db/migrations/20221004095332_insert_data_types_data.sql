-- migrate:up

INSERT INTO 
data_types (name)
VALUES 
("wrist mobility"),
("shoulder flexion"),
("shoulder extension"),
("walking"),
("breathing balance")

-- migrate:down

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE data_types;
SET FOREIGN_KEY_CHECKS = 1;