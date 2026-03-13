<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Gasto;
use App\Models\Mascota;
use Inertia\Inertia;

class GastosController extends Controller
{
    /**
     * Lista los gastos de las mascotas del usuario.
     */
    public function index()
    {
        $gastos = Gasto::whereHas('mascota', function ($query) {
                $query->where('usuario_id', auth()->id());
            })
            ->with('mascota:id,nombre')
            ->latest('fecha') // Ordenar por fecha del gasto
            ->paginate(10);

        return Inertia::render('Gastos/Index', [
            'gastos' => $gastos
        ]);
    }

    /**
     * Muestra el formulario para crear un nuevo gasto.
     */
    public function create()
    {
        $mascotas = Mascota::where('usuario_id', auth()->id())
            ->orderBy('nombre')
            ->get(['id', 'nombre']);

        return Inertia::render('Gastos/Create', [
            'mascotas' => $mascotas
        ]);
    }

    /**
     * Guarda un nuevo gasto.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'mascota_id'  => 'required|exists:mascotas,id',
            'categoria'   => 'required|string',
            'monto'       => 'required|numeric|min:0',
            'descripcion' => 'nullable|string',
            'fecha'       => 'required|date',
        ], [
            'mascota_id.required' => 'Debes seleccionar una mascota.',
            'monto.required'      => 'El monto es obligatorio.',
            'monto.numeric'       => 'El monto debe ser un número válido.',
            'categoria.required'  => 'La categoría es obligatoria.',
        ]);

        Gasto::create($validated);

        return redirect()->route('gastos.index')->with('message', 'Gasto registrado exitosamente.');
    }

    /**
     * Muestra el formulario para editar un gasto.
     */
    public function edit($id)
    {
        $gasto = Gasto::whereHas('mascota', function ($query) {
                $query->where('usuario_id', auth()->id());
            })->findOrFail($id);

        $mascotas = Mascota::where('usuario_id', auth()->id())
            ->orderBy('nombre')
            ->get(['id', 'nombre']);

        return Inertia::render('Gastos/Edit', [
            'gasto' => $gasto,
            'mascotas' => $mascotas
        ]);
    }

    /**
     * Actualiza el registro del gasto.
     */
    public function update(Request $request, $id)
    {
        // Validar que el gasto pertenezca al usuario
        $gasto = Gasto::whereHas('mascota', function ($query) {
            $query->where('usuario_id', auth()->id());
        })->findOrFail($id);

        $validated = $request->validate([
            'mascota_id'  => 'required|exists:mascotas,id',
            'categoria'   => 'required|string',
            'monto'       => 'required|numeric|min:0',
            'descripcion' => 'nullable|string',
            'fecha'       => 'required|date',
        ]);

        $gasto->update($validated);

        return redirect()->route('gastos.index')->with('message', 'Gasto actualizado correctamente.');
    }

    /**
     * Elimina un registro de gasto.
     */
    public function destroy($id)
    {
        $gasto = Gasto::whereHas('mascota', function ($query) {
                $query->where('usuario_id', auth()->id());
            })->findOrFail($id);

        $gasto->delete();

        return redirect()->route('gastos.index')->with('message', 'Gasto eliminado correctamente.');
    }
}