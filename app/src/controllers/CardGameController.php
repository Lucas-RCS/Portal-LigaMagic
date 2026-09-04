<?php
require_once __DIR__ . '/../config/config.php';
require_once SOURCE . '/repositories/CardGameRepository.php';
require_once SOURCE . '/repositories/CardGameEditionRepository.php';

requireAuth();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    exit('Method not allowed');
}

if (isset($_GET['game_id'])) {
    respondeJson(200, (object) ['items' => CardGameEditionRepository::findByGameId((int) $_GET['game_id'])]);
}

respondeJson(200, (object) ['items' => CardGameRepository::findAll()]);
