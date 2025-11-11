<?php

declare(strict_types=1);

use App\Application\Actions\Auth\LoginAction;
use App\Application\Actions\Auth\ChangePasswordAction;
use App\Application\Middleware\JwtAuthMiddleware;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\App;
use Slim\Interfaces\RouteCollectorProxyInterface as Group;

return function (App $app) {
    $app->group('/api', function (Group $group) {
        // Rotas públicas que não exigem autenticação
        $group->post('/v1/login', LoginAction::class);

        // Grupo de rotas protegidas pelo middleware de autenticação
        $group->group('/v1', function (Group $group) {
            $group->post('/change-password/{userPk}', ChangePasswordAction::class);
            
            $group->get('/modules', \App\Application\Actions\Module\ListModulesAction::class);

            $group->group('/usuarios', function (Group $userGroup) {
                $userGroup->get('', \App\Application\Actions\User\ListUsersAction::class);
                $userGroup->get('/{id}', \App\Application\Actions\User\ViewUserAction::class);
                $userGroup->post('', \App\Application\Actions\User\CreateUserAction::class);
                $userGroup->put('/{id}', \App\Application\Actions\User\UpdateUserAction::class);
                $userGroup->delete('/{id}', \App\Application\Actions\User\DeleteUserAction::class);
            });

            $group->get('/status', function (Request $request, Response $response) {
                $response->getBody()->write('API v1 is running!');
                return $response;
            });
        })->add(JwtAuthMiddleware::class);
    });
};
