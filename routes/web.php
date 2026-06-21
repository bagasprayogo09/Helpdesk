<?php

use App\Http\Controllers\AuditLogController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DivisiController;
use App\Http\Controllers\IssueCategoryController;
use App\Http\Controllers\TicketController;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');

    // Ticket Web Routes
    Route::get('tickets', [TicketController::class, 'index'])->name('tickets.index');
    Route::get('tickets/create', [TicketController::class, 'create'])->name('tickets.create');
    Route::get('tickets/{ticket}', [TicketController::class, 'show'])->name('tickets.show');
    Route::get('tickets/{ticket}/edit', [TicketController::class, 'edit'])->name('tickets.edit');

    // Settings Web Routes
    Route::inertia('settings/profile', 'settings/profile')->name('profile.edit');
    Route::inertia('settings/security', 'settings/security')->name('security.edit');
    Route::inertia('settings/appearance', 'settings/appearance')->name('appearance.edit');
});

// Admin Only Web Routes
Route::middleware(['auth', 'verified', 'role:admin'])->group(function () {
    Route::get('divisis', [DivisiController::class, 'index'])->name('divisis.index');
});

Route::middleware(['auth', 'verified', 'role:admin,supervisor'])->group(function () {
    Route::get('audit-logs', [AuditLogController::class, 'index'])->name('audit-logs.index');
    Route::get('issue-categories', [IssueCategoryController::class, 'index'])->name('issue-categories.index');
});
