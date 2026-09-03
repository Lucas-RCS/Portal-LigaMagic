<?php
declare(strict_types=1);

function log_json($data, $status_code = 200) {
    if (ob_get_length()) ob_clean();

    header('Content-Type: application/json; charset=utf-8');
    http_response_code($status_code);

    echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    exit;
}

function respondeJson(int $status, object | bool | null $content = null, object | null $error = null) : void {
    if (ob_get_length()) ob_clean();

    header('Content-Type: application/json; charset=utf-8');

    if($content){
        http_response_code($status);
        
        echo json_encode([
            "error" => false,
            "content" => $content
        ]);
    } else if($error){
        http_response_code($status);

        echo json_encode([
            "error" => true,
            "content" => $error
        ]);
    } else {
        http_response_code(500);

        echo json_encode([
            "error" => true,
            "content" => "Undefined Error"
        ]);
    }

    exit;
}

/**
 * Ensures the user is authenticated; otherwise, it responds with 401 and exits.
 */
function requireAuth(): void {
    if (empty($_SESSION['logged'])) {
        respondeJson(401, null, (object) ["message" => "Sessão expirada. Faça login novamente."]);
    }
}

/**
 * Reads and decodes the JSON body of the current request.
 */
function getJsonBody(): array {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);

    return is_array($data) ? $data : [];
}