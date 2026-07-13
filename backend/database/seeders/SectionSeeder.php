<?php

namespace Database\Seeders;

use App\Models\Section;
use Illuminate\Database\Seeder;

class SectionSeeder extends Seeder
{
    public function run(): void
    {
        $sections = [
            ['name' => 'Productos', 'route' => 'products'],
            ['name' => 'Usuarios', 'route' => 'users'],
            ['name' => 'Perfiles', 'route' => 'profiles'],
        ];

        foreach ($sections as $section) {
            Section::create($section);
        }
    }
}
