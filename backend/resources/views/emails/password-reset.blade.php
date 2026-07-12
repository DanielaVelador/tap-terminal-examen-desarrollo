@component('mail::message')
# Recuperación de contraseña

Hola {{ $userName }},

Recibimos una solicitud para restablecer tu contraseña. Aquí está tu nueva contraseña temporal:

@component('mail::panel')
{{ $newPassword }}
@endcomponent

Te recomendamos iniciar sesión y cambiarla lo antes posible desde tu perfil.

Si no solicitaste este cambio, contacta al administrador del sistema.

Saludos,<br>
{{ config('app.name') }}
@endcomponent