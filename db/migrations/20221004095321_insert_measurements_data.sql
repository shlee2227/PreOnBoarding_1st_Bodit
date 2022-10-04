-- migrate:up

INSERT INTO 
measurements (user_id, weight)
VALUES 
(1, 48.2),
(1, 48.3),
(1, 50.1),
(2, 53.2),
(2, 52.1),
(3, 57),
(4, 62.8),
(4, 60.9),
(4, 62.2),
(6, 74.4),
(6, 75.5)

-- migrate:down

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE measurements;
SET FOREIGN_KEY_CHECKS = 1;