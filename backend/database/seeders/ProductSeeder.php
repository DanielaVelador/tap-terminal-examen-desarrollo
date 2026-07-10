<?php

namespace Database\Seeders;

use App\Models\Counter;
use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            ['name' => 'Laptop Dell Inspiron 15', 'brand' => 'Dell', 'price' => 899],
            ['name' => 'Mouse Inalámbrico', 'brand' => 'Logitech', 'price' => 25],
            ['name' => 'Teclado Mecánico', 'brand' => 'Redragon', 'price' => 60],
            ['name' => 'Monitor 24 pulgadas', 'brand' => 'Samsung', 'price' => 210],
            ['name' => 'Audífonos Bluetooth', 'brand' => 'Sony', 'price' => 150],
            ['name' => 'Webcam HD', 'brand' => 'Logitech', 'price' => 45],
            ['name' => 'Disco SSD 1TB', 'brand' => 'Kingston', 'price' => 95],
            ['name' => 'Silla Ergonómica', 'brand' => 'HbadaOffice', 'price' => 999],
        ];

        foreach ($products as $product) {
            $sequence = Counter::next('products');
            $code = 'PROD-'.str_pad($sequence, 4, '0', STR_PAD_LEFT);

            Product::create([
                'code' => $code,
                'name' => $product['name'],
                'brand' => $product['brand'],
                'price' => $product['price'],
            ]);
        }
    }
}
