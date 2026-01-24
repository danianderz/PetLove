<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Momento;
use App\Models\Mascota;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class MomentosController extends Controller
{
    /**
     * Muestra la galería de momentos.
     */
    public function index()
    {
        $momentos = Momento::whereHas('mascota', function ($query) {
                $query->where('usuario_id', auth()->id());
            })
            ->with('mascota:id,nombre')
            ->latest('fecha_creacion')
            ->paginate(12); // Más elementos por página para la galería

        return Inertia::render('Momentos/Index', [
            'momentos' => $momentos
        ]);
    }

    /**
     * Formulario para subir un nuevo momento.
     */
    public function create()
    {
        $mascotas = Mascota::where('usuario_id', auth()->id())
            ->orderBy('nombre')
            ->get(['id', 'nombre']);

        return Inertia::render('Momentos/Create', [
            'mascotas' => $mascotas
        ]);
    }

    /**
     * Guarda la imagen y la anécdota.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'mascota_id' => 'required|exists:mascotas,id',
            'foto'       => 'required|image|mimes:jpeg,png,jpg,webp|max:2048', // Max 2MB
            'anecdota'   => 'required|string',
            'fecha_creacion' => 'nullable|date',
        ]);

        // Procesar la foto
        if ($request->hasFile('foto')) {
            $path = $request->file('foto')->store('momentos_fotos', 'public');
            $validated['ruta_foto'] = $path;
        }

        // Si no se envía fecha, usamos la actual
        $validated['fecha_creacion'] = $request->fecha_creacion ?? now();

        Momento::create($validated);

        return redirect()->route('momentos.index')->with('message', '¡Momento guardado con éxito!');
    }

    /**
     * Elimina el momento y su archivo físico del servidor.
     */
    public function destroy($id)
    {
        $momento = Momento::whereHas('mascota', function ($query) {
                $query->where('usuario_id', auth()->id());
            })->findOrFail($id);

        // Borrar el archivo de imagen del almacenamiento
        if ($momento->ruta_foto) {
            Storage::disk('public')->delete($momento->ruta_foto);
        }

        $momento->delete();

        return redirect()->route('momentos.index')->with('message', 'Momento eliminado.');
    }
    public function edit($id)
{
    $momento = Momento::whereHas('mascota', function ($query) {
            $query->where('usuario_id', auth()->id());
        })->findOrFail($id);

    $mascotas = Mascota::where('usuario_id', auth()->id())
        ->orderBy('nombre')
        ->get(['id', 'nombre']);

    return Inertia::render('Momentos/Edit', [
        'momento' => $momento,
        'mascotas' => $mascotas
    ]);
}

/**
 * Actualiza el momento en la base de datos.
 */
public function update(Request $request, $id)
{
    $momento = Momento::findOrFail($id);
    
    $validated = $request->validate([
        'mascota_id' => 'required|exists:mascotas,id',
        'anecdota'   => 'required|string',
        'foto'       => 'nullable|image|max:2048', 
    ]);

    if ($request->hasFile('foto')) {
        // Eliminar foto vieja
        Storage::disk('public')->delete($momento->ruta_foto);
        // Guardar la nueva
        $validated['ruta_foto'] = $request->file('foto')->store('momentos_fotos', 'public');
    }

    $momento->update($validated);

    return redirect()->route('momentos.index')->with('success', 'Momento actualizado.');
}

/**
 * Fuerza la descarga del archivo.
 */
public function download($id)
{
    $momento = Momento::findOrFail($id);
    // Verificamos que el archivo existe
    if (!Storage::disk('public')->exists($momento->ruta_foto)) {
        abort(404);
    }
    
    return Storage::disk('public')->download($momento->ruta_foto);
}
}