<?php
require_once SOURCE . "/repositories/UserRepository.php";

function makeLogin(string $login, string $password) : object | null {
    $user = UserRepository::getByLogin($login);

    if($user == false) return null;

    if(password_verify($password, $user->password))
        return $user;
    else
        return null;
}