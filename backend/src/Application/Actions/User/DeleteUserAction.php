<?php

declare(strict_types=1);

namespace App\Application\Actions\User;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Container\ContainerInterface;
use PDO;

class DeleteUserAction
{
    private $container;

    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
    }

    public function __invoke(Request $request, Response $response, array $args): Response
    {
        $userId = (int) $args['id'];
        
        // --- Lógica de Multi-empresa e Auditoria ---
        $tokenData = $request->getAttribute('token_data');
        $cnpj_empresa_logada = $tokenData['userCnpj'];
        $usuario_logado_pk = $tokenData['userId'];
        $status_excluido = 2; // 0=Inativo, 1=Ativo, 2=Excluído

        $sql = "UPDATE usuarios 
                SET ic_status = :status, 
                    dt_utl_atualizacao = NOW(), 
                    usuario_ult_atualizacao_pk = :user_pk
                WHERE pk = :id AND cnpj_cpf_contas_clientes = :cnpj";

        try {
            $pdo = $this->container->get('pdo');
            $stmt = $pdo->prepare($sql);
            $stmt->bindParam(':status', $status_excluido, PDO::PARAM_INT);
            $stmt->bindParam(':user_pk', $usuario_logado_pk, PDO::PARAM_INT);
            $stmt->bindParam(':id', $userId, PDO::PARAM_INT);
            $stmt->bindParam(':cnpj', $cnpj_empresa_logada);
            
            $stmt->execute();

            if ($stmt->rowCount() > 0) {
                $response->getBody()->write(json_encode(['message' => 'Usuário desativado com sucesso.']));
                return $response->withHeader('Content-Type', 'application/json')->withStatus(200);
            } else {
                return $response->withStatus(404); // Usuário não encontrado ou não pertence à empresa
            }

        } catch (\Exception $e) {
            $response->getBody()->write(json_encode(['message' => 'Erro ao desativar usuário', 'error' => $e->getMessage()]));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
        }
    }
}
