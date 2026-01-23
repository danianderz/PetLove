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
        Schema::create('registros_medicos', function (Blueprint $table) {
            $table->id();
            
            
            $table->foreignId('mascota_id')->constrained('mascotas')->onDelete('cascade');
            
            // Datos del registro
            $table->string('tipo'); 
            $table->string('titulo'); 
            $table->text('descripcion')->nullable(); 
            $table->dateTime('fecha_cita'); 
            
            // Estado
            $table->boolean('completado')->default(false);

            $table->timestamps();
        });
    }

    
    public function down(): void
    {
        Schema::dropIfExists('registros_medicos');
    }
};