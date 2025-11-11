<?php

declare(strict_types=1);

namespace App\Application\Actions\User;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Container\ContainerInterface;
use PDO;

class ViewUserAction
{
    private $container;

    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
    }

    public function __invoke(Request $request, Response $response, array $args): Response
    {
        $userId = (int) $args['id'];
        
        $tokenData = $request->getAttribute('token_data');
        $cnpj_empresa_logada = $tokenData['userCnpj'];

        $sql = "SELECT pk, ds_usuario, ds_login, ds_cel, ic_status 
                FROM usuarios 
                WHERE pk = :id AND cnpj_cpf_contas_clientes = :cnpj";

        try {
            $pdo = $this->container->get('pdo');
            $stmt = $pdo->prepare($sql);
            $stmt->bindParam(':id', $userId, PDO::PARAM_INT);
            $stmt->bindParam(':cnpj', $cnpj_empresa_logada);
            $stmt->execute();
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($user) {
                $response->getBody()->write(json_encode($user));
                return $response->withHeader('Content-Type', 'application/json')->withStatus(200);
            } else {
                return $response->withStatus(404); // Usuário não encontrado ou não pertence à empresa
            }

        } catch (\Exception $e) {
            $response->getBody()->write(json_encode(['message' => 'Erro ao buscar usuário', 'error' => $e->getMessage()]));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
        }
    }
}
