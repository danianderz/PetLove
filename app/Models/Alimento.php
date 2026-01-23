<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Alimento extends Model
{
    use HasFactory;

    protected $table = 'alimentacion';

    protected $fillable = [
        'mascota_id',
        'nombre',
        'marca',
        'cantidad_diaria',
        'notas',
    ];

    public function mascota(): BelongsTo
    {
        return $this->belongsTo(Mascota::class);
    }
}