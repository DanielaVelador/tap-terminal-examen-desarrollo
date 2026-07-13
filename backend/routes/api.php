<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/password/forgot', [AuthController::class, 'forgotPassword']);

Route::middleware('auth:api')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::middleware('section:products')->group(function () {
        Route::get('/products/export/pdf', [ProductController::class, 'exportPdf']);
        Route::get('/products/export/excel', [ProductController::class, 'exportExcel']);
        Route::apiResource('products', ProductController::class);
    });
});
