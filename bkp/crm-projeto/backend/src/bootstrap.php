<?php

declare(strict_types=1);

require_once __DIR__ . '/../vendor/autoload.php';

// Load environment variables
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

use Slim\App;
use Slim\Middleware\ErrorMiddleware;

return function (App $app) {
    $container = $app->getContainer();

    // Add Error Middleware
    $displayErrorDetails = $container->get('settings')['displayErrorDetails'];
    $logError = $container->get('settings')['logError'];
    $logErrorDetails = $container->get('settings')['logErrorDetails'];

    $errorMiddleware = new ErrorMiddleware(
        $app->getCallableResolver(),
        $app->getResponseFactory(),
        $displayErrorDetails,
        $logError,
        $logErrorDetails
    );
    $app->add($errorMiddleware);
};
