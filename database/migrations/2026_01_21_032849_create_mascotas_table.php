<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('mascotas', function (Blueprint $table) {
            $table->id();
            // Relación con la tabla usuarios
            $table->foreignId('usuario_id')->constrained('users')->onDelete('cascade');
            
            $table->string('nombre');
            $table->string('foto')->nullable();
            $table->string('raza')->nullable();
            $table->date('fecha_nacimiento')->nullable();
            $table->decimal('peso', 8, 2)->nullable();
            $table->string('genero');
            
            // Laravel usa created_at y updated_at por defecto para fechas de creación
            $table->timestamps(); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mascotas');
    }
};
