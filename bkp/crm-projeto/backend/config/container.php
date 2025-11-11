<?php

declare(strict_types=1);

use DI\ContainerBuilder;
use Psr\Container\ContainerInterface;
use Slim\Views\Twig;
use Monolog\Logger;
use Monolog\Handler\StreamHandler;
use Psr\Log\LoggerInterface;
use function DI\autowire;
use function DI\get;

return function (ContainerBuilder $containerBuilder) {
    $containerBuilder->addDefinitions([
        'view' => function (ContainerInterface $container) {
            $twig = Twig::create(__DIR__ . '/../templates', ['cache' => false]);
            return $twig;
        },

        'pdo' => function (ContainerInterface $container) {
            $settings = $container->get('settings')['db'];
            $host = $settings['host'];
            $dbname = $settings['dbname'];
            $user = $settings['user'];
            $pass = $settings['pass'];
            $charset = 'utf8mb4';

            $dsn = "mysql:host=$host;dbname=$dbname;charset=$charset";
            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ];

            try {
                return new PDO($dsn, $user, $pass, $options);
            } catch (\PDOException $e) {
                throw new \PDOException($e->getMessage(), (int)$e->getCode());
            }
        },

        // Adiciona o mapeamento explícito
        PDO::class => get('pdo'),

        App\Domain\Repositories\ModuleRepositoryInterface::class => autowire(App\Infrastructure\Persistence\MySqlModuleRepository::class),

        LoggerInterface::class => function (ContainerInterface $container) {
            $settings = $container->get('settings')['logger'];
            $logger = new Logger($settings['name']);
            $logger->pushHandler(new StreamHandler($settings['path'], $settings['level']));
            return $logger;
        },
    ]);
};