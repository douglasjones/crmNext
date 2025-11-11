<?php

declare(strict_types=1);

namespace App\Application\Actions\User;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Container\ContainerInterface;
use PDO;

class CreateUserAction
{
    private $container;

    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
    }

    public function __invoke(Request $request, Response $response): Response
    {
        $data = $request->getParsedBody();

        // Validação básica dos dados recebidos
        if (empty($data['ds_usuario']) || empty($data['ds_login']) || empty($data['ds_senha'])) {
            $response->getBody()->write(json_encode(['message' => 'Campos obrigatórios não preenchidos.']));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
        }

        // --- Lógica de Multi-empresa e Auditoria ---
        $tokenData = $request->getAttribute('token_data');
        $cnpj_empresa_logada = $tokenData['userCnpj'];
        $usuario_logado_pk = $tokenData['userId'];

        // Criptografar a senha
        $hashedPassword = password_hash($data['ds_senha'], PASSWORD_DEFAULT);

        $sql = "INSERT INTO usuarios (
                    dt_cadastro, usuario_cadastro_pk, dt_utl_atualizacao, usuario_ult_atualizacao_pk,
                    ds_usuario, ds_login, ds_senha, ds_cel, ic_status, cnpj_cpf_contas_clientes
                ) VALUES (
                    NOW(), :user_pk, NOW(), :user_pk,
                    :ds_usuario, :ds_login, :ds_senha, :ds_cel, :ic_status, :cnpj
                )";

        try {
            $pdo = $this->container->get('pdo');
            $stmt = $pdo->prepare($sql);

            $stmt->bindParam(':user_pk', $usuario_logado_pk, PDO::PARAM_INT);
            $stmt->bindParam(':ds_usuario', $data['ds_usuario']);
            $stmt->bindParam(':ds_login', $data['ds_login']);
            $stmt->bindParam(':ds_senha', $hashedPassword);
            $stmt->bindParam(':ds_cel', $data['ds_cel']);
            $stmt->bindParam(':ic_status', $data['ic_status'], PDO::PARAM_INT);
            $stmt->bindParam(':cnpj', $cnpj_empresa_logada);
            
            $stmt->execute();
            $newUserId = $pdo->lastInsertId();

            $response->getBody()->write(json_encode(['message' => 'Usuário criado com sucesso', 'id' => $newUserId]));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(201);

        } catch (\Exception $e) {
            $response->getBody()->write(json_encode(['message' => 'Erro ao criar usuário', 'error' => $e->getMessage()]));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
        }
    }
}
