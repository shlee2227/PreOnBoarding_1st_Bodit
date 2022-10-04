-- migrate:up

INSERT INTO 
users (name, birth, height, phone)
VALUES 
("Kimcode", "1997-08-19", 157.2, "010-0000-0000"),
("Leecoder", "1989-10-15", 161, "010-1111-1111"),
("Shimvalues", "1992-03-07", 167.4, "010-2222-2222"),
("Kangdata", "2000-01-01", 172.6, "010-3333-3333"),
("Choiquery", "2003-01-31", 179.1, "010-4444-4444"),
("Jodebug", "2007-05-30", 182.5, "010-5555-5555")

-- migrate:down

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE users;
SET FOREIGN_KEY_CHECKS = 1;