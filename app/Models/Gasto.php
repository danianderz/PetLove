<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Gasto extends Model
{
    use HasFactory;

    // Nombre de la tabla
    protected $table = 'gastos';

    protected $fillable = [
        'mascota_id',
        'categoria',
        'monto',
        'descripcion',
        'fecha',
    ];

    /**
     * Los atributos que deben ser convertidos a tipos nativos.
     */
    protected $casts = [
        'monto' => 'decimal:2',
        'fecha' => 'date',
    ];

    /**
     * Relación: Un gasto pertenece a una mascota.
     */
    public function mascota(): BelongsTo
    {
        return $this->belongsTo(Mascota::class);
    }
}
