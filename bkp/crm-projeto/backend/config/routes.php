<?php

declare(strict_types=1);

use App\Application\Actions\Auth\LoginAction;
use App\Application\Actions\Auth\ChangePasswordAction; // Adicionar esta linha
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\App;
use Slim\Interfaces\RouteCollectorProxyInterface as Group;

return function (App $app) {
    $app->group('/api', function (Group $group) {
        $group->group('/v1', function (Group $group) {
            $group->post('/login', LoginAction::class);
            $group->post('/change-password/{userPk}', ChangePasswordAction::class);
            $group->get('/modules', \App\Application\Actions\Module\ListModulesAction::class); // Nova rota para listar módulos

            $group->get('/status', function (Request $request, Response $response) {
                $response->getBody()->write('API v1 is running!');
                return $response;
            });
        });
    });
};