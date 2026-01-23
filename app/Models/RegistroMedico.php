<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RegistroMedico extends Model
{
    use HasFactory;

    // Nombre de la tabla (opcional si sigue la convención, pero seguro)
    protected $table = 'registros_medicos';

    protected $fillable = [
        'mascota_id',
        'tipo',
        'titulo',
        'descripcion',
        'fecha_cita',
        'completado',
    ];

    protected $casts = [
        'completado' => 'boolean',
        'fecha_cita' => 'datetime',
    ];

    /**
     * Relación: Un registro médico pertenece a una mascota.
     */
    public function mascota(): BelongsTo
    {
        return $this->belongsTo(Mascota::class);
    }
}