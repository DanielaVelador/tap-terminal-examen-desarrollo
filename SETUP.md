# TAP Terminal — Examen de Admisión, Área de Desarrollo

Sistema full-stack con Laravel 11 (API REST + MongoDB), Angular 19, autenticación JWT, control de acceso por perfiles/secciones, bitácora de auditoría, y exportación de datos a PDF/Excel.

## Stack técnico

- **Backend:** Laravel 11 + PHP 8.2, MongoDB (`mongodb/laravel-mongodb`)
- **Frontend:** Angular 19 (standalone components) + Angular Material
- **Autenticación:** JWT (`tymon/jwt-auth`) — *no Sanctum*, ver nota abajo
- **Base de datos:** MongoDB 7 (Docker local)
- **Contenedores:** Docker Compose (backend, frontend, MongoDB, Mongo Express)

## Requisitos previos

- Docker Desktop (con WSL2 backend en Windows)
- Git

No necesitas instalar PHP, Composer, Node ni MongoDB en tu máquina — todo corre en contenedores.

## Instalación y arranque

### 1. Clona el repositorio

```bash
git clone https://github.com/DanielaVelador/tap-terminal-examen-desarrollo.git
cd proyecto-tap
```

### 2. Variables de entorno del backend

Copia `.env.example` a `.env` dentro de `backend/` si no existe, y confirma estos valores clave:

```env
DB_CONNECTION=mongodb
DB_URI=mongodb://root:rootpassword@mongodb:27017
DB_DATABASE=tap_db

CACHE_STORE=file

JWT_SECRET=<generar con el comando de abajo>

MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=<tu usuario de Mailtrap>
MAIL_PASSWORD=<tu password de Mailtrap>
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@tapterminal.com
MAIL_FROM_NAME="TAP Terminal"
```

> **Nota:** `CACHE_STORE=file` es necesario porque el driver por defecto (`database`) requiere una tabla SQL para el sistema de rate limiting, incompatible con MongoDB.

### 3. Levanta los contenedores

```bash
docker-compose up -d --build
```

Esto levanta 4 servicios:

| Servicio | URL |
|---|---|
| Backend (Laravel API) | http://localhost:8000 |
| Frontend (Angular) | http://localhost:4200 |
| MongoDB | localhost:27017 (uso interno) |
| Mongo Express (admin visual de BD) | http://localhost:8081 (usuario: `admin`, contraseña: `admin`) |

### 4. Genera las claves de la aplicación (solo la primera vez)

```bash
docker exec -it tap_backend php artisan key:generate
docker exec -it tap_backend php artisan jwt:secret
```

### 5. Enlaza el storage público (para fotos de perfil)

```bash
docker exec -it tap_backend php artisan storage:link
```

### 6. Corre los seeders (datos base: secciones y productos de ejemplo)

```bash
docker exec -it tap_backend php artisan db:seed
```

### 7. Crea un usuario administrador de prueba

```bash
docker exec -it tap_backend php artisan tinker
```

```php
$user = new \App\Models\User();
$user->name = 'Admin Test';
$user->email = 'admin@test.com';
$user->password = bcrypt('password123');
$user->save();

$sections = \App\Models\Section::all()->pluck('_id')->toArray();
$profile = \App\Models\Profile::create(['name' => 'Administrador', 'section_ids' => $sections]);

$user->profile_ids = [$profile->_id];
$user->save();
exit
```

### 8. Accede a la aplicación

Abre **http://localhost:4200** e inicia sesión con:
- **Email:** `admin@test.com`
- **Contraseña:** `password123`

## Estructura del proyecto

```
proyecto-tap/
├── docker-compose.yml
├── backend/          # Laravel 11 + MongoDB + JWT
├── frontend/          # Angular 19 + Angular Material
└── postman/           # Colección y environment de Postman (documentación de API)
```

## Documentación de la API

La colección completa de Postman (con ejemplos de request/response para todos los endpoints) está en `postman/`. Impórtala junto con el environment `TAP Local` en Postman para probar todos los endpoints documentados.

## Funcionalidades implementadas

- **Autenticación:** login, logout, recuperación de contraseña (envío real de correo), rate limiting en ambos endpoints.
- **CRUD de Productos:** con código autogenerado, exportación PDF/Excel.
- **CRUD de Usuarios:** con foto de perfil, validación de teléfono/email, detalle con perfiles anidados, exportación PDF/Excel.
- **CRUD de Perfiles:** con selección de secciones, detalle con secciones anidadas, exportación PDF/Excel.
- **Control de acceso:** middleware de autorización por sección (backend) + guards de ruta (frontend) según el perfil del usuario.
- **Bitácora de auditoría:** registro automático de creación/actualización/eliminación en todos los modelos principales, vía Observer.

## Comandos útiles

```bash
# Ver logs de un servicio
docker-compose logs -f backend
docker-compose logs -f frontend

# Ejecutar comandos artisan
docker exec -it tap_backend php artisan <comando>

# Ejecutar comandos ng
docker exec -it tap_frontend ng <comando>

# Formatear código PHP (PSR-12)
docker exec -it tap_backend ./vendor/bin/pint

# Detener todo
docker-compose down

# Detener y borrar también los datos (reinicia la BD desde cero)
docker-compose down -v
```