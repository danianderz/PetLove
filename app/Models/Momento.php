<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Momento extends Model
{
    use HasFactory;

    // Nombre de la tabla según tu diagrama
    protected $table = 'momentos';

    // Desactivamos timestamps estándar si solo usas fecha_creacion
    // Si dejaste $table->timestamps() en la migración, cámbialo a true
    public $timestamps = true;

    protected $fillable = [
        'mascota_id',
        'ruta_foto',
        'anecdota',
        'fecha_creacion',
    ];

    /**
     * Atributos que deben ser convertidos.
     */
    protected $casts = [
        'fecha_creacion' => 'datetime',
    ];

    /**
     * Relación: Un momento (foto/anécdota) pertenece a una mascota.
     */
    public function mascota(): BelongsTo
    {
        return $this->belongsTo(Mascota::class);
    }
}