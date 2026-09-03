<?php
require_once SOURCE . '/config/db.php';

class UserRepository{
    static function getByLogin(string $login) : object | null {
        $pdo = db();
        $stmt = $pdo->prepare("SELECT id, login, name, password FROM user WHERE login = :login");
        $stmt->execute([':login' => $login]);
        $user = $stmt->fetch();

        if($user == false) return null;

        return (object) [
            "id" => $user['id'], 
            "login" => $user['login'], 
            "name" => $user['name'], 
            "password" => $user['password']
        ];
    }
}