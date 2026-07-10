FROM php:8.2-cli

# Dependencias del sistema y extensiones PHP necesarias
RUN apt-get update && apt-get install -y \
        git curl zip unzip libzip-dev libpng-dev libonig-dev libxml2-dev libssl-dev \
    && docker-php-ext-install pdo mbstring zip exif pcntl gd \
    && pecl install mongodb \
    && docker-php-ext-enable mongodb \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

EXPOSE 8000

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]