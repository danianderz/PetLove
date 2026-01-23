<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\RegistroMedico;
use App\Models\Mascota;
use Inertia\Inertia;

class ResgistrosController extends Controller
{
    public function index()
    {
        // Traemos los registros del usuario autenticado, cargando la relación 'mascota'
        $registros = RegistroMedico::whereHas('mascota', function ($query) {
                $query->where('usuario_id', auth()->id());
            })
            ->with('mascota:id,nombre') // Solo traemos id y nombre para optimizar
            ->latest()
            ->paginate(10);

        return Inertia::render('Registros/Index', [
            'registros' => $registros
        ]);
    }

    /**
     * Muestra el formulario para crear un nuevo registro.
     */
    public function create()
    {
        // Necesitamos enviar las mascotas del usuario para el selector (Select)
        $mascotas = Mascota::where('usuario_id', auth()->id())
            ->orderBy('nombre')
            ->get(['id', 'nombre']);

        return Inertia::render('Registros/Create', [
            'mascotas' => $mascotas
        ]);
    }

    /**
     * Guarda un nuevo registro médico.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'mascota_id'  => 'required|exists:mascotas,id',
            'tipo'        => 'required|string',
            'titulo'      => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'fecha_cita'  => 'required|date',
            'completado'  => 'required|boolean',
        ], [
            'mascota_id.required' => 'Debes seleccionar una mascota.',
            'titulo.required'     => 'El título o motivo es obligatorio.',
            'fecha_cita.required' => 'La fecha de la cita es obligatoria.',
        ]);

        RegistroMedico::create($validated);

        return redirect()->route('registros.index')->with('message', 'Registro médico creado exitosamente.');
    }

    /**
     * Muestra el formulario para editar un registro.
     */
    public function edit($id)
    {
        // Buscamos el registro asegurándonos de que pertenezca a una mascota del usuario
        $registro = RegistroMedico::whereHas('mascota', function ($query) {
                $query->where('usuario_id', auth()->id());
            })->findOrFail($id);

        $mascotas = Mascota::where('usuario_id', auth()->id())
            ->orderBy('nombre')
            ->get(['id', 'nombre']);

        return Inertia::render('Registros/Edit', [
            'registro' => $registro,
            'mascotas' => $mascotas
        ]);
    }

    /**
     * Actualiza el registro médico.
     */
    public function update(Request $request, $id)
    {
        $registro = RegistroMedico::findOrFail($id);

        $validated = $request->validate([
            'mascota_id'  => 'required|exists:mascotas,id',
            'tipo'        => 'required|string',
            'titulo'      => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'fecha_cita'  => 'required|date',
            'completado'  => 'required|boolean',
        ]);

        $registro->update($validated);

        return redirect()->route('registros.index')->with('message', 'Registro médico actualizado correctamente.');
    }

    /**
     * Elimina un registro médico.
     */
    public function destroy($id)
    {
        $registro = RegistroMedico::whereHas('mascota', function ($query) {
                $query->where('usuario_id', auth()->id());
            })->findOrFail($id);

        $registro->delete();

        return redirect()->route('registros.index')->with('message', 'Registro médico eliminado.');
    }
}
