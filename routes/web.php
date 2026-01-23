<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MascotasController;
use App\Http\Controllers\ResgistrosController;
use App\Http\Controllers\AlimentosController;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return redirect()->route('mascotas.index');
    })->name('dashboard');


    Route::get('/mascotas', [MascotasController::class, 'index'])->name('mascotas.index');
    Route::post('/mascotas', [MascotasController::class, 'store'])->name('mascotas.store');
    Route::get('/mascotas/create', [MascotasController::class, 'create'])->name('mascotas.create');
    Route::get('/mascotas/{id}/edit', [MascotasController::class, 'edit'])->name('mascotas.edit');
    Route::put('/mascotas/{id}', [MascotasController::class, 'update'])->name('mascotas.update');
    Route::delete('/mascotas/{id}', [MascotasController::class, 'destroy'])->name('mascotas.destroy');

    Route::resource('registros', ResgistrosController::class)->names([
    'index'   => 'registros.index',
    'create'  => 'registros.create',
    'store'   => 'registros.store',
    'edit'    => 'registros.edit',
    'update'  => 'registros.update',
    'destroy' => 'registros.destroy',
    ]);
    // Rutas para el CRUD de Alimentos
    Route::resource('alimentacion', AlimentosController::class)->names([
    'index'   => 'alimentacion.index',
    'create'  => 'alimentacion.create',
    'store'   => 'alimentacion.store',
    'edit'    => 'alimentacion.edit',
    'update'  => 'alimentacion.update',
    'destroy' => 'alimentacion.destroy',
]);
    
});

require __DIR__.'/settings.php';
