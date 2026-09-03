<?php
require_once SOURCE . '/config/db.php';

class CardRepository
{
    static function findAll(array $filters, int $page, int $perPage): array
    {
        $pdo = db();
        $where = [];
        $params = [];

        if (!empty($filters['q'])) {
            $where[] = '(c.name_ing LIKE :q_ing OR c.name_por LIKE :q_por)';
    
            $searchTerm = '%' . $filters['q'] . '%';
            $params[':q_ing'] = $searchTerm;
            $params[':q_por'] = $searchTerm;
        }
        if (!empty($filters['game_id'])) {
            $where[] = 'c.game_id = :game_id';
            $params[':game_id'] = $filters['game_id'];
        }
        if (!empty($filters['edition_id'])) {
            $where[] = 'c.edition_id = :edition_id';
            $params[':edition_id'] = $filters['edition_id'];
        }
        if (!empty($filters['rarity'])) {
            $where[] = 'c.rarity = :rarity';
            $params[':rarity'] = $filters['rarity'];
        }

        $whereSql = $where ? 'WHERE ' . implode(' AND ', $where) : '';

        $countStmt = $pdo->prepare("SELECT COUNT(*) AS total FROM card c $whereSql");
        $countStmt->execute($params);
        $total = (int) $countStmt->fetch()['total'];

        $offset = ($page - 1) * $perPage;

        $stmt = $pdo->prepare(
            "SELECT c.id, c.name_ing, c.name_por, c.game_id, g.name AS game_name,
                    c.edition_id, e.name AS edition_name, c.image, c.rarity
             FROM card c
             LEFT JOIN card_game g ON g.id = c.game_id
             LEFT JOIN card_game_edition e ON e.id = c.edition_id
             $whereSql
             ORDER BY c.id DESC
             LIMIT :limit OFFSET :offset"
        );

        foreach ($params as $key => $value) {
            $stmt->bindValue($key, $value);
        }
        $stmt->bindValue(':limit', $perPage, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();

        return [
            'items' => $stmt->fetchAll(),
            'total' => $total,
        ];
    }

    static function findById(int $id): array|null
    {
        $pdo = db();
        $stmt = $pdo->prepare(
            "SELECT c.id, c.name_ing, c.name_por, c.game_id, g.name AS game_name,
                    c.edition_id, e.name AS edition_name, c.image, c.rarity
             FROM card c
             LEFT JOIN card_game g ON g.id = c.game_id
             LEFT JOIN card_game_edition e ON e.id = c.edition_id
             WHERE c.id = :id"
        );
        $stmt->execute([':id' => $id]);
        $card = $stmt->fetch();

        return $card ?: null;
    }

    static function create(array $data): int
    {
        $pdo = db();
        $stmt = $pdo->prepare(
            "INSERT INTO card (name_ing, name_por, game_id, edition_id, image, rarity)
             VALUES (:name_ing, :name_por, :game_id, :edition_id, :image, :rarity)"
        );
        $stmt->execute([
            ':name_ing' => $data['name_ing'],
            ':name_por' => $data['name_por'] ?: null,
            ':game_id' => $data['game_id'],
            ':edition_id' => $data['edition_id'],
            ':image' => $data['image'] ?: null,
            ':rarity' => $data['rarity'],
        ]);

        return (int) $pdo->lastInsertId();
    }

    static function update(int $id, array $data): bool
    {
        $pdo = db();
        $stmt = $pdo->prepare(
            "UPDATE card SET name_ing = :name_ing, name_por = :name_por, game_id = :game_id,
                    edition_id = :edition_id, image = :image, rarity = :rarity
             WHERE id = :id"
        );

        return $stmt->execute([
            ':name_ing' => $data['name_ing'],
            ':name_por' => $data['name_por'] ?: null,
            ':game_id' => $data['game_id'],
            ':edition_id' => $data['edition_id'],
            ':image' => $data['image'] ?: null,
            ':rarity' => $data['rarity'],
            ':id' => $id,
        ]);
    }

    static function delete(int $id): bool
    {
        $pdo = db();
        $stmt = $pdo->prepare('DELETE FROM card WHERE id = :id');

        return $stmt->execute([':id' => $id]);
    }
}
