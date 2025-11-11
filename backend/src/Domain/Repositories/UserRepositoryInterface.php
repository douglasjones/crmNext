<?php

declare(strict_types=1);

namespace App\Domain\Repositories;

interface UserRepositoryInterface
{
    public function findAll(): array;
}
