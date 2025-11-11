<?php
declare(strict_types=1);

namespace App\Domain\Repositories;

use App\Domain\Entities\Module;

interface ModuleRepositoryInterface
{
    /**
     * @return Module[]
     */
    public function findAll(): array;

    public function findModuleOfId(int $id): ?Module;
}
