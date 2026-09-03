<?php
require_once SOURCE . "/repositories/UserRepository.php";

function makeLogin(string $login, string $password) : int | null {
    $user = UserRepository::getByLogin($login);

    if($user == false) return null;

    if(password_verify($password, $user->password))
        return $user->id;
    else
        return null;
}