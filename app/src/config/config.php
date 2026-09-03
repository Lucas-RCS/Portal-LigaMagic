<?php
declare(strict_types=1);

session_start();

if (!defined('SOURCE')) {
    define('SOURCE', realpath(__DIR__ . '/../'));
}

require_once  SOURCE . '/includes/functions.php';

if (basename($_SERVER['SCRIPT_FILENAME']) === basename(__FILE__)) {
    http_response_code(403);
    exit('Acesso negado.');
}


const APP_NAME = 'Portal LigaMagic';
