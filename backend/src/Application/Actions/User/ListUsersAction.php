<?php

declare(strict_types=1);

namespace App\Application\Actions\User;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Container\ContainerInterface;
use PDO;

class ListUsersAction
{
    private $container;

    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
    }

    public function __invoke(Request $request, Response $response): Response
    {
        // Pega os dados do token que o middleware decodificou e anexou à requisição
        $tokenData = $request->getAttribute('token_data');
        $cnpj_empresa_logada = $tokenData['userCnpj'];

        $sql = "SELECT pk, ds_usuario, ds_login, ic_status 
                FROM usuarios 
                WHERE cnpj_cpf_contas_clientes = :cnpj";

        try {
            $pdo = $this->container->get('pdo');
            $stmt = $pdo->prepare($sql);
            $stmt->bindParam(':cnpj', $cnpj_empresa_logada);
            $stmt->execute();
            $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $response->getBody()->write(json_encode($users));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(200);

        } catch (\Exception $e) {
            $response->getBody()->write(json_encode(['message' => 'Erro ao buscar usuários', 'error' => $e->getMessage()]));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
        }
    }
}