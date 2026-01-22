<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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
}
