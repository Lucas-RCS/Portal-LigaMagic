<?php

require_once  __DIR__ . '/../config/config.php';
require_once SOURCE . '/service/LoginService.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(404);
    exit('Page not found');
}

$login = htmlspecialchars($_POST['login']);
$password = htmlspecialchars($_POST['pass']);

$result = makeLogin($login, $password);

if($result == null)
    respondeJson(200, null, (object) [ "message" => "Error logging in; please try again later." ]);
else {
    $_SESSION["userId"] = $result->id;
    $_SESSION["logged"] = true;
    $_SESSION["userName"] = $result->name;

    respondeJson(200, true);
}