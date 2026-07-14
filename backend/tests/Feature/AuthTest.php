<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;

class AuthTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
    }

    public function test_login_exitoso()
    {
        User::create([
            'code' => 'USR-0001',
            'name' => 'Juan Pérez',
            'email' => 'juan@example.com',
            'password' => bcrypt('password123'),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'juan@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'access_token',
                'token_type',
                'expires_in',
            ]);
    }

    public function test_login_con_credenciales_invalidas()
    {
        User::create([
            'code' => 'USR-0002',
            'name' => 'Ana Gómez',
            'email' => 'ana@example.com',
            'password' => bcrypt('password123'),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'ana@example.com',
            'password' => 'contraseña-incorrecta',
        ]);

        $response->assertStatus(401)
            ->assertJson([
                'error' => 'Credenciales inválidas',
            ]);
    }

    public function test_no_permite_acceder_sin_token()
    {
        $response = $this->getJson('/api/me');

        $response->assertStatus(401);
    }
}
