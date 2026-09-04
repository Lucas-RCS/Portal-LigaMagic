<?php
require_once SOURCE . '/config/db.php';

class CardGameEditionRepository
{
    static function findByGameId(int $gameId): array
    {
        $pdo = db();
        $stmt = $pdo->prepare('SELECT id, name FROM card_game_edition WHERE game_id = :game_id ORDER BY name');
        $stmt->execute([':game_id' => $gameId]);

        return $stmt->fetchAll();
    }
}
