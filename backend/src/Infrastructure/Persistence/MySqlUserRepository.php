<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence;

use App\Domain\Repositories\UserRepositoryInterface;
use PDO;

class MySqlUserRepository implements UserRepositoryInterface
{
    private $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function findAll(): array
    {
        $stmt = $this->pdo->query("SELECT pk, ds_usuario, ds_login, ic_status as ic_status_usuario FROM usuarios");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
