<?php
require_once SOURCE . '/repositories/CardRepository.php';

class CardService
{
    static function list(array $filters, int $page, int $perPage): array
    {
        return CardRepository::findAll($filters, $page, $perPage);
    }

    static function get(int $id): array|null
    {
        return CardRepository::findById($id);
    }

    static function create(array $data): array
    {
        self::validate($data);
        $id = CardRepository::create($data);

        return CardRepository::findById($id);
    }

    static function update(int $id, array $data): array
    {
        self::validate($data);
        CardRepository::update($id, $data);

        return CardRepository::findById($id);
    }

    static function delete(int $id): bool
    {
        return CardRepository::delete($id);
    }

    private static function validate(array $data): void
    {
        if (empty($data['name_ing'])) {
            throw new InvalidArgumentException('O nome da carta em inglês é obrigatório.');
        }
        if (empty($data['game_id'])) {
            throw new InvalidArgumentException('O card game é obrigatório.');
        }
        if (empty($data['edition_id'])) {
            throw new InvalidArgumentException('A edição é obrigatória.');
        }
        if (empty($data['rarity'])) {
            throw new InvalidArgumentException('A raridade é obrigatória.');
        }
    }
}
