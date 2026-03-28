FROM php:8.4-apache

RUN apt-get update && apt-get install -y \
    zip unzip git curl libpng-dev libonig-dev libxml2-dev libzip-dev libpq-dev libicu-dev \
    && docker-php-ext-install pdo pdo_mysql pdo_pgsql mbstring exif pcntl bcmath gd zip intl

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY . .

RUN COMPOSER_ALLOW_SUPERUSER=1 composer install --no-dev --optimize-autoloader --no-scripts --ignore-platform-req=ext-sodium --prefer-dist --no-interaction -vvv

RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

RUN a2enmod rewrite

COPY apache.conf /etc/apache2/sites-available/000-default.conf

EXPOSE 80

CMD php artisan config:clear && \
    php artisan route:clear && \
    php artisan view:clear && \
    php artisan storage:link || true && \
    php artisan package:discover --ansi && \
    php artisan migrate --force && \
    apache2-foreground