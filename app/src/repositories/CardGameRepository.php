<?php
require_once SOURCE . '/config/db.php';

class CardGameRepository
{
    static function findAll(): array
    {
        $pdo = db();

        return $pdo->query('SELECT id, name FROM card_game ORDER BY name')->fetchAll();
    }
}
