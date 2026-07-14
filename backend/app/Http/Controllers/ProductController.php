<?php

namespace App\Http\Controllers;

use App\Models\Counter;
use App\Models\Product;
use Illuminate\Http\Request;
use App\Exports\ProductsExport;
use Maatwebsite\Excel\Facades\Excel;
use Barryvdh\DomPDF\Facade\Pdf;

class ProductController extends Controller
{
    public function index()
    {
        return response()->json(Product::orderBy('created_at', 'desc')->get());
    }

    public function show(string $id)
    {
        $product = Product::find($id);

        if (! $product) {
            return response()->json(['error' => 'Producto no encontrado'], 404);
        }

        return response()->json($product);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'brand' => 'required|string|max:255',
            'price' => 'required|integer|min:0|max:999',
        ]);

        $sequence = Counter::next('products');
        $code = 'PROD-'.str_pad($sequence, 4, '0', STR_PAD_LEFT);

        $product = Product::create([
            'code' => $code,
            'name' => $request->name,
            'brand' => $request->brand,
            'price' => $request->price,
        ]);

        return response()->json($product, 201);
    }

    public function update(Request $request, string $id)
    {
        $product = Product::find($id);

        if (! $product) {
            return response()->json(['error' => 'Producto no encontrado'], 404);
        }

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'brand' => 'sometimes|required|string|max:255',
            'price' => 'sometimes|required|integer|min:0|max:999',
        ]);

        $product->update($request->only(['name', 'brand', 'price']));

        return response()->json($product);
    }

    public function destroy(string $id)
    {
        $product = Product::find($id);

        if (! $product) {
            return response()->json(['error' => 'Producto no encontrado'], 404);
        }

        $product->delete();

        return response()->json(['message' => 'Producto eliminado correctamente']);
    }
    public function exportPdf()
    {
        $products = Product::orderBy('created_at', 'desc')->get();

        $pdf = Pdf::loadView('exports.products-pdf', compact('products'));

        return $pdf->download('productos.pdf');
    }

    public function exportExcel()
    {
        return Excel::download(new ProductsExport(), 'productos.xlsx');
    }
}
