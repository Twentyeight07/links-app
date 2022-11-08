CREATE DATABASE database_link;

USE database_link;

--Users table

CREATE TABLE users(
  id INT(11) NOT NULL AUTO_INCREMENT,
  username VARCHAR(16) NOT NULL,
  password VARCHAR(40) NOT NULL,
  fullname VARCHAR(100),
  PRIMARY KEY(id)
)

--Links table

CREATE TABLE links(
  id INT(11) NOT NULL AUTO_INCREMENT,
  title VARCHAR(150) NOT NULL,
  url VARCHAR(255) NOT NULL,
  description TEXT,
  user_id INT(11),
  created_at timestamp NOT NULL DEFAULT current_timestamp,
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id),
  PRIMARY KEY(id)
)