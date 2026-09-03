<?php
require_once __DIR__ . '/../config/config.php';
require_once SOURCE . '/service/CardService.php';

requireAuth();

$method = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? (int) $_GET['id'] : null;

try {
    switch ($method) {
        case 'GET':
            if ($id) {
                $card = CardService::get($id);

                if (!$card) {
                    respondeJson(404, null, (object) ['message' => 'Carta não encontrada.']);
                }

                respondeJson(200, (object) $card);
            }

            $filters = [
                'q' => $_GET['q'] ?? null,
                'game_id' => $_GET['game_id'] ?? null,
                'edition_id' => $_GET['edition_id'] ?? null,
                'rarity' => $_GET['rarity'] ?? null,
            ];
            $page = max(1, (int) ($_GET['page'] ?? 1));
            $perPage = max(1, min(100, (int) ($_GET['per_page'] ?? 5)));

            $result = CardService::list($filters, $page, $perPage);

            respondeJson(200, (object) [
                'items' => $result['items'],
                'total' => $result['total'],
                'page' => $page,
                'per_page' => $perPage,
            ]);
            break;

        case 'POST':
            $card = CardService::create(getJsonBody());
            respondeJson(201, (object) $card);
            break;

        case 'PUT':
            if (!$id) {
                respondeJson(400, null, (object) ['message' => 'Id da carta é obrigatório.']);
            }

            $card = CardService::update($id, getJsonBody());
            respondeJson(200, (object) $card);
            break;

        case 'DELETE':
            if (!$id) {
                respondeJson(400, null, (object) ['message' => 'Id da carta é obrigatório.']);
            }

            CardService::delete($id);
            respondeJson(200, (object) ['id' => $id]);
            break;

        default:
            http_response_code(405);
            exit('Method not allowed');
    }
} catch (InvalidArgumentException $e) {
    respondeJson(422, null, (object) ['message' => $e->getMessage()]);
} catch (Throwable $e) {
    log_json($e);
    respondeJson(500, null, (object) ['message' => 'Error processing the request.']);
}
