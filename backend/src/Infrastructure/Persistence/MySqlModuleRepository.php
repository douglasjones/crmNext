<?php
declare(strict_types=1);

namespace App\Infrastructure\Persistence;

use App\Domain\Entities\Module;
use App\Domain\Repositories\ModuleRepositoryInterface;
use PDO;

class MySqlModuleRepository implements ModuleRepositoryInterface
{
    private PDO $connection;

    public function __construct(PDO $connection)
    {
        $this->connection = $connection;
    }

    /**
     * {@inheritdoc}
     */
    public function findAll(): array
    {
        $stmt = $this->connection->query('SELECT * FROM modulos WHERE ic_menu = 1 AND ic_status = 1 ORDER BY nr_ordem_menu ASC');
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $modules = [];
        foreach ($data as $row) {
            $modules[] = new Module(
                $row['pk'],
                $row['ds_modulo'],
                $row['ds_dominio'],
                $row['tipo_modulo_pk'],
                $row['ic_menu'],
                $row['nr_ordem_menu'] ?? null,
                $row['modulo_pai_pk'] ?? null,
                $row['dt_cadastro'],
                $row['usuario_cadastro_pk'] ?? null,
                $row['dt_ult_atualizacao'],
                $row['usuario_ult_atualizacao_pk'] ?? null,
                $row['ds_icone'] ?? null
            );
        }

        return $modules;
    }

    /**
     * {@inheritdoc}
     */
    public function findModuleOfId(int $id): ?Module
    {
        $stmt = $this->connection->prepare('SELECT * FROM modulos WHERE pk = :id');
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$row) {
            return null;
        }

        return new Module(
            $row['pk'],
            $row['ds_modulo'],
            $row['ds_dominio'],
            $row['tipo_modulo_pk'],
            $row['ic_menu'],
            $row['nr_ordem_menu'],
            $row['dt_cadastro'],
            $row['usuario_cadastro_pk'],
            $row['dt_ult_atualizacao'],
            $row['usuario_ult_atualizacao_pk']
        );
    }
}