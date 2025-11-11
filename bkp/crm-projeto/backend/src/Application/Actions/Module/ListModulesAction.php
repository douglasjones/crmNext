<?php
declare(strict_types=1);

namespace App\Application\Actions\Module;

use App\Application\Actions\Action;
use App\Domain\Repositories\ModuleRepositoryInterface;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Log\LoggerInterface;

class ListModulesAction extends Action
{
    private ModuleRepositoryInterface $moduleRepository;

    public function __construct(LoggerInterface $logger, ModuleRepositoryInterface $moduleRepository)
    {
        parent::__construct($logger);
        $this->moduleRepository = $moduleRepository;
    }

    protected function action(): Response
    {
        $modules = $this->moduleRepository->findAll();

        return $this->respondWithData($modules);
    }
}
