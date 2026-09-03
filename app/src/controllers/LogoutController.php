<?php
require_once __DIR__ . '/../config/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(404);
    exit('Page not found');
}

$_SESSION = [];
session_destroy();

respondeJson(200, true);
