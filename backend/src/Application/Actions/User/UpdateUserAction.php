<?php

declare(strict_types=1);

namespace App\Application\Actions\User;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Container\ContainerInterface;
use PDO;

class UpdateUserAction
{
    private $container;

    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
    }

    public function __invoke(Request $request, Response $response, array $args): Response
    {
        $userId = (int) $args['id'];
        $data = $request->getParsedBody();

        // --- Lógica de Multi-empresa e Auditoria ---
        $tokenData = $request->getAttribute('token_data');
        $cnpj_empresa_logada = $tokenData['userCnpj'];
        $usuario_logado_pk = $tokenData['userId'];

        // Construção dinâmica da query
        $fields = [];
        $params = [
            'id' => $userId,
            'cnpj' => $cnpj_empresa_logada,
            'user_pk' => $usuario_logado_pk
        ];

        if (isset($data['ds_usuario'])) {
            $fields[] = 'ds_usuario = :ds_usuario';
            $params['ds_usuario'] = $data['ds_usuario'];
        }
        if (isset($data['ds_login'])) {
            $fields[] = 'ds_login = :ds_login';
            $params['ds_login'] = $data['ds_login'];
        }
        if (isset($data['ds_cel'])) {
            $fields[] = 'ds_cel = :ds_cel';
            $params['ds_cel'] = $data['ds_cel'];
        }
        if (isset($data['ic_status'])) {
            $fields[] = 'ic_status = :ic_status';
            $params['ic_status'] = $data['ic_status'];
        }
        // Apenas atualiza a senha se uma nova for enviada
        if (!empty($data['ds_senha'])) {
            $fields[] = 'ds_senha = :ds_senha';
            $params['ds_senha'] = password_hash($data['ds_senha'], PASSWORD_DEFAULT);
        }

        if (empty($fields)) {
            $response->getBody()->write(json_encode(['message' => 'Nenhum dado para atualizar.']));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
        }

        $fields[] = 'dt_utl_atualizacao = NOW()';
        $fields[] = 'usuario_ult_atualizacao_pk = :user_pk';

        $sql = "UPDATE usuarios SET " . implode(', ', $fields) . " WHERE pk = :id AND cnpj_cpf_contas_clientes = :cnpj";

        try {
            $pdo = $this->container->get('pdo');
            $stmt = $pdo->prepare($sql);
            
            foreach ($params as $key => &$val) {
                $stmt->bindParam($key, $val);
            }

            $stmt->execute();

            if ($stmt->rowCount() > 0) {
                $response->getBody()->write(json_encode(['message' => 'Usuário atualizado com sucesso.']));
                return $response->withHeader('Content-Type', 'application/json')->withStatus(200);
            } else {
                return $response->withStatus(404); // Usuário não encontrado ou não pertence à empresa
            }

        } catch (\Exception $e) {
            $response->getBody()->write(json_encode(['message' => 'Erro ao atualizar usuário', 'error' => $e->getMessage()]));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
        }
    }
}
