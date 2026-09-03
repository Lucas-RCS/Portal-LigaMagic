-- Removes the database and everything in it if it already exists
SET NAMES utf8mb4;

DROP DATABASE IF EXISTS app_db;

-- Creates and selects the database from scratch
CREATE DATABASE app_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE app_db;

-- User table
CREATE TABLE IF NOT EXISTS `user` (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    login VARCHAR(80) NOT NULL UNIQUE,
    name VARCHAR(180) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Game table
CREATE TABLE IF NOT EXISTS `card_game` (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(180) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Edition table
CREATE TABLE IF NOT EXISTS `card_game_edition` (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(180) NOT NULL,
    game_id INT UNSIGNED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (game_id) REFERENCES `card_game`(id) ON DELETE CASCADE
);

-- Card table
CREATE TABLE IF NOT EXISTS `card` (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name_ing VARCHAR(180) NOT NULL,
    name_por VARCHAR(180) NOT NULL,
    game_id INT UNSIGNED,
    edition_id INT UNSIGNED,
    image VARCHAR(255),
    rarity VARCHAR(80),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (game_id) REFERENCES `card_game`(id) ON DELETE SET NULL,
    FOREIGN KEY (edition_id) REFERENCES `card_game_edition`(id) ON DELETE SET NULL
);

-- Insert user
INSERT INTO user (login, name, password, created_at) VALUES
('ADMIN', 'Administrador', "$2y$10$nFHLEwKjs4l2UW6aNRZfDugcFMRgMJEh/4R9uMwcNK8PVmlFdv9d2", NOW());

-- Insert games
INSERT INTO card_game (name) VALUES 
('magic'),
('pokemon'),
('yugioh');

-- Insert editions for magic (game_id = 1)
INSERT INTO card_game_edition (name, game_id) VALUES 
('Dominaria', 1),
('War of the Spark', 1),
('Throne of Eldraine', 1),
('The Hobbit', 1),
('Marvel Super Heroes', 1);

-- Insert editions for pokemon (game_id = 2)
INSERT INTO card_game_edition (name, game_id) VALUES 
('Base Set', 2),
('Sword & Shield', 2),
('Scarlet & Violet', 2),
('30th Celebration', 2),
('Chaos Rising', 2);

-- Insert editions for yugioh (game_id = 3)
INSERT INTO card_game_edition (name, game_id) VALUES 
('Legend of Blue Eyes White Dragon', 3),
('Metal Raiders', 3),
('Starter Deck: Yugi', 3),
('Rise of the Duelist', 3),
('Blazing Dominion', 3);

-- Insert sample cards (initial seed data)
INSERT INTO card (name_ing, name_por, game_id, edition_id, image, rarity) VALUES
('Black Lotus', 'Lótus Negra', 1, 1, 'https://gatherer-static.wizards.com/Cards/medium/8EF154010202F1165F73FEC893EBED861411C88F00BD065B1839C8736376C455.webp', 'mitica'),
('Pikachu', 'Pikachu', 2, 8, 'https://gatherer-static.wizards.com/Cards/medium/B9DF5A112A43051D8869ED651B05A4F2E0A2D2FD446B7112CFBA1138F990DA04.webp', 'rara'),
('Blue-Eyes White Dragon', 'Dragão Branco de Olhos Azuis', 3, 11, 'https://gatherer-static.wizards.com/Cards/medium/E538EF6A7698980EEFBBE06CF2D20231D9A2692CF2C03DD3F5DAC263CB4C3B72.webp', 'ultra-rara'),
('Charizard', 'Charizard', 2, 6, 'https://gatherer-static.wizards.com/Cards/medium/DF7F9619429903D3A77F5D349ACE92838ECDF7A081614AF719CDB7BAAD0C80A2.webp', 'rara'),
('Lightning Bolt', 'Raio', 1, 5, 'https://gatherer-static.wizards.com/Cards/medium/0DF252CBC4D27AD1DAEBDD3D79E36BAEC42F452A8D85E86F79379865CAE7A146.webp', 'comum');