<?php

declare(strict_types=1);

namespace App\Application\Actions\Auth;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Container\ContainerInterface;
use Firebase\JWT\JWT;
use PDO;

class LoginAction
{
    private $container;

    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
    }

    public function __invoke(Request $request, Response $response): Response
    {
        $data = $request->getParsedBody();
        $ds_login = $data['ds_login'] ?? null;
        $ds_senha = $data['ds_senha'] ?? null;

        if ($ds_login === null || $ds_senha === null) {
            $response->getBody()->write(json_encode(['message' => 'Login e senha são obrigatórios']));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
        }

        // Passo 1: Buscar usuário apenas pelo login (Otimizado)
        $sql = "SELECT 
                    cc.pk as contas_pk, 
                    cc.ds_cnpj_cpf, 
                    cc.ds_razao_social, 
                    cc.ds_lead, 
                    cc.ic_status as ic_status_conta, 
                    u.pk, 
                    u.ds_usuario, 
                    u.ds_login,
                    u.ds_senha, -- Traz a senha para verificação no PHP
                    u.ic_status as ic_status_usuario 
                FROM usuarios u 
                INNER JOIN contas_clientes cc ON u.cnpj_cpf_contas_clientes = cc.ds_cnpj_cpf 
                WHERE u.ds_login = :ds_login";

        try {
            $pdo = $this->container->get('pdo');
            $stmt = $pdo->prepare($sql);
            $stmt->bindParam(':ds_login', $ds_login);
            $stmt->execute();
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            // Passo 2: Verificar a senha no PHP (Inseguro, mas rápido)
            if ($user && $user['ds_senha'] === $ds_senha) {
                // Usuário e senha corretos, gerar JWT
                $settings = $this->container->get('settings');
                $secretKey = $settings['jwt']['secret'];
                $issuedAt = time();
                $expire = $issuedAt + 3600; // 1 hour

                $needsPasswordChange = ($ds_senha === 'gpros');

                $tokenPayload = [
                    'iat' => $issuedAt,
                    'exp' => $expire,
                    'data' => [
                        'userId' => $user['pk'],
                        'userName' => $user['ds_usuario'],
                        'userCnpj' => $user['ds_cnpj_cpf'] // CNPJ adicionado ao token
                    ]
                ];

                $token = JWT::encode($tokenPayload, $secretKey, 'HS256');

                // Remover a senha da resposta por segurança
                unset($user['ds_senha']);

                $responseData = [
                    'user' => $user,
                    'token' => $token,
                    'needsPasswordChange' => $needsPasswordChange
                ];

                $response->getBody()->write(json_encode($responseData));
                return $response->withHeader('Content-Type', 'application/json')->withStatus(200);
            } else {
                // Usuário não encontrado ou senha incorreta
                $response->getBody()->write(json_encode(['message' => 'Credenciais inválidas']));
                return $response->withHeader('Content-Type', 'application/json')->withStatus(401);
            }
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode(['message' => 'Erro interno do servidor', 'error' => $e->getMessage()]));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
        }
    }
}
