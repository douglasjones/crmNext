<?php

declare(strict_types=1);

namespace App\Application\Actions\Auth;

use App\Application\Actions\Action;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Log\LoggerInterface;
use PDO;

class ChangePasswordAction extends Action
{
    protected PDO $pdo;

    public function __construct(LoggerInterface $logger, PDO $pdo)
    {
        parent::__construct($logger);
        $this->pdo = $pdo;
    }

    protected function action(): Response
    {
        $userPk = (int) $this->resolveArg('userPk');
        
        // CORREÇÃO: Usando o método correto para obter os dados do corpo da requisição
        $data = $this->request->getParsedBody();
        
        $newPassword = $data['newPassword'] ?? null;

        if (!$userPk || !$newPassword) {
            $this->logger->warning('Tentativa de alterar senha sem userPk ou newPassword.', ['userPk' => $userPk]);
            return $this->respondWithData(['message' => 'ID do usuário e nova senha são obrigatórios.'], 400);
        }

        try {
            $hashedPassword = $newPassword;

            $stmt = $this->pdo->prepare("UPDATE usuarios SET ds_senha = :password WHERE pk = :userPk");
            $stmt->bindParam(':password', $hashedPassword, PDO::PARAM_STR);
            $stmt->bindParam(':userPk', $userPk, PDO::PARAM_INT);
            
            $stmt->execute();

            $rowCount = $stmt->rowCount();

            if ($rowCount > 0) {
                $this->logger->info('Senha do usuário atualizada com sucesso.', ['userPk' => $userPk, 'rowCount' => $rowCount]);
                return $this->respondWithData(['message' => 'Senha alterada com sucesso.']);
            } else {
                $this->logger->warning('Nenhuma linha foi alterada para o usuário. A senha pode já ser a mesma ou o usuário não existe.', ['userPk' => $userPk]);
                return $this->respondWithData(['message' => 'A senha não foi alterada. O usuário pode não ter sido encontrado ou a nova senha é igual à antiga.'], 404);
            }

        } catch (\PDOException $e) {
            $this->logger->error('Erro de banco de dados ao tentar alterar a senha.', [
                'userPk' => $userPk,
                'error' => $e->getMessage()
            ]);
            return $this->respondWithData(['message' => 'Erro interno do servidor ao tentar alterar a senha.'], 500);
        }
    }
}