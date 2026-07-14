<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Profile;
use App\Models\Section;

class ProductTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
    }

    /**
     * Crea un usuario autenticado con acceso a la sección indicada.
     *
     * @return array{0: User, 1: string}
     */
    private function createUserWithSectionAccess(string $route = 'products'): array
    {
        $section = Section::create([
            'name' => 'Productos',
            'route' => $route,
        ]);

        $profile = Profile::create([
            'name' => 'Administrador',
            'section_ids' => [$section->_id],
        ]);

        $user = User::create([
            'code' => 'USR-' . uniqid(),
            'name' => 'Usuario de Prueba',
            'email' => 'user' . uniqid() . '@example.com',
            'password' => bcrypt('password123'),
            'profile_ids' => [$profile->_id],
        ]);

        $token = auth('api')->login($user);

        return [$user, $token];
    }

    public function test_crea_un_producto_con_datos_validos()
    {
        [$user, $token] = $this->createUserWithSectionAccess();

    $response = $this->withHeader('Authorization', "Bearer {$token}")
        ->postJson('/api/products', [
            'name' => 'Producto de prueba',
            'brand' => 'Marca X',
            'price' => 100,
        ]);

    $response->assertStatus(201)
        ->assertJsonFragment([
            'name' => 'Producto de prueba',
            'brand' => 'Marca X',
            'price' => 100,
        ]);
    }

    public function test_no_crea_un_producto_sin_nombre()
    {
        [$user, $token] = $this->createUserWithSectionAccess();

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/products', [
                'brand' => 'Marca X',
                'price' => 100,
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('name');
    }

    public function test_deniega_el_acceso_a_usuario_sin_la_seccion_products()
    {
        $otraSeccion = Section::create([
            'name' => 'Reportes',
            'route' => 'reports',
        ]);

        $profile = Profile::create([
            'name' => 'Solo Reportes',
            'section_ids' => [$otraSeccion->_id],
        ]);

        $user = User::create([
            'code' => 'USR-' . uniqid(),
            'name' => 'Usuario Limitado',
            'email' => 'limitado' . uniqid() . '@example.com',
            'password' => bcrypt('password123'),
            'profile_ids' => [$profile->_id],
        ]);

        $token = auth('api')->login($user);

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/products', [
                'name' => 'Producto de prueba',
                'brand' => 'Marca X',
                'price' => 100,
            ]);

        $response->assertStatus(403);
    }

    public function test_devuelve_401_sin_token()
    {
        $response = $this->postJson('/api/products', [
            'name' => 'Producto de prueba',
            'brand' => 'Marca X',
            'price' => 100,
        ]);

        $response->assertStatus(401);
    }
}