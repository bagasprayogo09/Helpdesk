<?php

use App\Http\Controllers\Api\Auth\LoginController;
use App\Http\Controllers\Api\Auth\RegisterController;
use App\Http\Controllers\Api\Divisi\DivisiController;
use App\Http\Controllers\Api\IssueCategory\IssueCategoryController;
use App\Http\Controllers\Api\Settings\ProfileController;
use App\Http\Controllers\Api\Settings\SecurityController;
use App\Http\Controllers\Api\Ticket\TicketController;
use Illuminate\Support\Facades\Route;

// Auth Routes (Guest)
Route::middleware('guest')->group(function () {
    Route::post('register', [RegisterController::class, 'register'])->name('api.register');
    Route::post('login', [LoginController::class, 'login'])->name('api.login');
});

// Auth Routes (Authenticated)
Route::middleware('auth')->group(function () {
    Route::post('logout', [LoginController::class, 'logout'])->name('api.logout');
});

// Divisi Routes (Admin only)
Route::middleware(['auth', 'verified', 'role:admin'])->group(function () {
    Route::get('divisis', [DivisiController::class, 'index'])->name('api.divisi.index');
    Route::post('divisis', [DivisiController::class, 'store'])->name('api.divisi.store');
    Route::put('divisis/{divisi}', [DivisiController::class, 'update'])->name('api.divisi.update');
    Route::delete('divisis/{divisi}', [DivisiController::class, 'destroy'])->name('api.divisi.destroy');
});

// Issue Category Routes (Admin, Supervisor)
Route::middleware(['auth', 'verified', 'role:admin,supervisor'])->group(function () {
    Route::get('issue-categories', [IssueCategoryController::class, 'index'])->name('api.issue-categories.index');
    Route::post('issue-categories', [IssueCategoryController::class, 'store'])->name('api.issue-categories.store');
    Route::put('issue-categories/{issue_category}', [IssueCategoryController::class, 'update'])->name('api.issue-categories.update');
    Route::delete('issue-categories/{issue_category}', [IssueCategoryController::class, 'destroy'])->name('api.issue-categories.destroy');
});

// Settings / Profile / Password Routes
Route::middleware(['auth'])->group(function () {
    Route::get('settings/profile', [ProfileController::class, 'show'])->name('api.profile.show');
    Route::patch('settings/profile', [ProfileController::class, 'update'])->name('api.profile.update');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('api.profile.destroy');
    Route::put('settings/password', [SecurityController::class, 'update'])
        ->middleware('throttle:6,1')
        ->name('api.user-password.update');
});

// Ticket Routes (Authenticated, Verified)
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('tickets', [TicketController::class, 'index'])->name('api.tickets.index');
    Route::post('tickets', [TicketController::class, 'store'])->name('api.tickets.store');
    Route::get('tickets/{ticket}', [TicketController::class, 'show'])->name('api.tickets.show');
    Route::put('tickets/{ticket}', [TicketController::class, 'update'])->name('api.tickets.update');
    Route::delete('tickets/{ticket}', [TicketController::class, 'destroy'])->name('api.tickets.destroy');
});
