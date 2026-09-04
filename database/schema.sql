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
('Black Lotus', 'Lótus Negra', 1, 1, 'https://repositorio.sbrauble.com/arquivos/in/magic/316/5f4243bcb4fea-6psa8u-bmqzh2-19055be5ac0bf0e333b42e1965c78eff.jpg', 'mitica'),
('Pikachu', 'Pikachu', 2, 8, 'https://mcdn.pokemon.com/image/upload/c_fit,w_384,h_535/f_auto/q_auto:best/v1/live/pcom-cms/static-assets/cms3/br/img/trading-card-game/tiles/30th/cards/full/30th_PT-BR_23.png', 'rara'),
('Blue-Eyes White Dragon', 'Dragão Branco de Olhos Azuis', 3, 11, 'https://repositorio.sbrauble.com/arquivos/in/yugioh_bkp/cd/249/134.jpg', 'ultra-rara'),
('Charizard', 'Charizard', 2, 6, 'https://img.mypcards.com/img/2/2348/pokemon_mc24_001_015/pokemon_mc24_001_015_en-1771534423_thumb.jpg', 'rara'),
('Lightning Bolt', 'Raio', 1, 5, 'https://repositorio.sbrauble.com/arquivos/in/magic/480968/6a29d4d1ca500-ptmb2-t5ler-3246d690edcb0d9a18099e37d07ede11.jpg', 'comum');