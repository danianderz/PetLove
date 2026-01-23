<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Mascota extends Model
{
    protected $fillable = [
        'usuario_id',
        'nombre',
        'foto',
        'raza',
        'fecha_nacimiento',
        'peso',
        'genero',
    ];

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }

    /**
     * Relación: Una mascota puede tener muchos registros médicos.
     */
    public function registrosMedicos(): HasMany
    {
        return $this->hasMany(RegistroMedico::class);
    }
    public function alimentos(): HasMany
    {
        return $this->hasMany(Alimento::class);
    }
}