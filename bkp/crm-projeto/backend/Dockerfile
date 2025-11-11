FROM php:8.2-fpm

# Extensões PHP
RUN docker-php-ext-install pdo pdo_mysql

WORKDIR /var/www

# Instalar Git e Unzip
RUN apt-get update && apt-get install -y git unzip

# Instalar Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
COPY . .
RUN composer install --no-dev --optimize-autoloader

EXPOSE 9000
CMD ["php-fpm"]