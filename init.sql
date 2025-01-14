GRANT CREATE ON *.* TO 'user'@'%';
CREATE DATABASE IF NOT EXISTS `streamium_shadow`;
GRANT ALL PRIVILEGES ON `streamium_shadow`.* TO 'user'@'%';
GRANT ALL PRIVILEGES ON `streamium`.* TO 'user'@'%';
FLUSH PRIVILEGES;
