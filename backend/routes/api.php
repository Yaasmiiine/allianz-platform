<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ClaimController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\StatsController;

// ✅ TEST ROUTE
Route::get('/test-db', function () {
    DB::connection()->getPdo();
    return response()->json(['message' => 'Database connection successful']);
});

// ✅ AUTH ROUTES
Route::middleware('throttle:auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::put('/profile', [ProfileController::class, 'update']);

    Route::get('/stats', [StatsController::class, 'index']);

    Route::get('/claims', [ClaimController::class, 'index']);
    Route::get('/claims/{id}', [ClaimController::class, 'show']);
    Route::post('/claims', [ClaimController::class, 'store']);

    Route::middleware('admin')->group(function () {
        Route::put('/claims/{id}/status', [ClaimController::class, 'updateStatus']);
    });

    Route::get('/payments', [PaymentController::class, 'index']);
    Route::post('/payments/checkout', [PaymentController::class, 'createCheckoutSession']);
    Route::post('/payments/confirm', [PaymentController::class, 'confirmPayment']);

    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);
    Route::delete('/notifications/clear-all', [NotificationController::class, 'clearAll']);
});
