<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Alimento;
use App\Models\Mascota;
use Inertia\Inertia;

class AlimentosController extends Controller
{
    /**
     * Lista los alimentos de las mascotas del usuario.
     */
    public function index()
    {
        $alimentos = Alimento::whereHas('mascota', function ($query) {
                $query->where('usuario_id', auth()->id());
            })
            ->with('mascota:id,nombre')
            ->latest()
            ->paginate(10);

        return Inertia::render('Alimentos/Index', [
            'alimentos' => $alimentos
        ]);
    }

    /**
     * Formulario para nuevo alimento.
     */
    public function create()
    {
        $mascotas = Mascota::where('usuario_id', auth()->id())
            ->orderBy('nombre')
            ->get(['id', 'nombre']);

        return Inertia::render('Alimentos/Create', [
            'mascotas' => $mascotas
        ]);
    }

    /**
     * Guarda el alimento en la base de datos.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'mascota_id'      => 'required|exists:mascotas,id',
            'nombre'          => 'required|string|max:255',
            'marca'           => 'required|string|max:255',
            'cantidad_diaria' => 'required|string|max:255',
            'notas'           => 'nullable|string',
        ], [
            'mascota_id.required'      => 'Debes seleccionar una mascota.',
            'nombre.required'          => 'El nombre del alimento es obligatorio.',
            'marca.required'           => 'La marca es obligatoria.',
            'cantidad_diaria.required' => 'La porción diaria es obligatoria.',
        ]);

        Alimento::create($validated);

        return redirect()->route('alimentacion.index')->with('message', 'Plan de alimentación creado exitosamente.');
    }

    /**
     * Formulario de edición.
     */
    public function edit($id)
    {
        $alimento = Alimento::whereHas('mascota', function ($query) {
                $query->where('usuario_id', auth()->id());
            })->findOrFail($id);

        $mascotas = Mascota::where('usuario_id', auth()->id())
            ->orderBy('nombre')
            ->get(['id', 'nombre']);

        return Inertia::render('Alimentos/Edit', [
            'alimento' => $alimento,
            'mascotas' => $mascotas
        ]);
    }

    /**
     * Actualiza el registro de alimento.
     */
    public function update(Request $request, $id)
    {
        $alimento = Alimento::whereHas('mascota', function ($query) {
                $query->where('usuario_id', auth()->id());
            })->findOrFail($id);

        $validated = $request->validate([
            'mascota_id'      => 'required|exists:mascotas,id',
            'nombre'          => 'required|string|max:255',
            'marca'           => 'required|string|max:255',
            'cantidad_diaria' => 'required|string|max:255',
            'notas'           => 'nullable|string',
        ]);

        $alimento->update($validated);

        return redirect()->route('alimentacion.index')->with('message', 'Plan de alimentación actualizado correctamente.');
    }

    /**
     * Elimina el registro.
     */
    public function destroy($id)
    {
        $alimento = Alimento::whereHas('mascota', function ($query) {
                $query->where('usuario_id', auth()->id());
            })->findOrFail($id);

        $alimento->delete();

        return redirect()->route('alimentacion.index')->with('message', 'Registro de alimento eliminado.');
    }
}
