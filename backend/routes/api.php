<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\LogController;
use App\Http\Controllers\SectionController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/password/forgot', [AuthController::class, 'forgotPassword']);

Route::middleware('auth:api')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::get('/sections', [SectionController::class, 'index']);
    Route::get('/me/sections', [AuthController::class, 'mySections']);
    Route::get('/logs', [LogController::class, 'index']);

    Route::middleware('section:products')->group(function () {
        Route::get('/products/export/pdf', [ProductController::class, 'exportPdf']);
        Route::get('/products/export/excel', [ProductController::class, 'exportExcel']);
        Route::apiResource('products', ProductController::class);
    });

    Route::middleware('section:users')->group(function () {
        Route::get('/users/export/pdf', [UserController::class, 'exportPdf']);
        Route::get('/users/export/excel', [UserController::class, 'exportExcel']);
        Route::apiResource('users', UserController::class);
    });

    Route::middleware('section:profiles')->group(function () {
        Route::get('/profiles/export/pdf', [ProfileController::class, 'exportPdf']);
        Route::get('/profiles/export/excel', [ProfileController::class, 'exportExcel']);
        Route::apiResource('profiles', ProfileController::class);
    });
});
