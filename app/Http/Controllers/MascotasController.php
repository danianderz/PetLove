<?php

namespace App\Http\Controllers;

use App\Models\Mascota;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MascotasController extends Controller
{
    public function index()
    {
        $mascotas = Mascota::where('usuario_id', auth()->id())->get();
        return Inertia::render('Mascotas/Index', [
            'mascotas' => $mascotas
        ]);
    }
    public function create()
    {
        return Inertia::render('Mascotas/Create', []);
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
        'nombre'           => 'required|string|max:255',
        'raza'             => 'required|string|max:255',
        'genero'           => 'required|string',
        'peso'             => 'nullable|numeric',
        'fecha_nacimiento' => 'nullable|date',
        'foto'             => 'nullable|image|max:2048', // Máximo 2MB
    ], [
        // Mensajes personalizados en español
        'nombre.required' => 'El nombre de la mascota es obligatorio.',
        'genero.required' => 'Debes seleccionar si es Macho o Hembra.',
        'raza.required'   => 'La raza de la mascota es obligatoria.',
        'peso.numeric'    => 'El peso debe ser un número (ejemplo: 12.5).',
        'fecha_nacimiento.date' => 'La fecha de nacimiento no tiene un formato válido.',
        'foto.image'      => 'El archivo seleccionado debe ser una imagen.',
        'foto.max'        => 'La foto no debe pesar más de 2MB.',
    ]);  
       $path = null;
        if ($request->hasFile('foto')) {
        // Esto guarda el archivo en storage/app/public/mascotas
        $path = $request->file('foto')->store('mascotas', 'public');
        }
        Mascota::create([
            'usuario_id'       => $request->user()->id,
            'nombre'           => $validated['nombre'],
            'raza'             => $validated['raza'],
            'genero'           => $validated['genero'],
            'peso'             => $validated['peso'] ?? null,
            'fecha_nacimiento' => $validated['fecha_nacimiento'] ?? null,
            'foto'             => isset($validated['foto']) ? $validated['foto']->store('mascotas', 'public') : null,
        ]);
        return redirect()->route('mascotas.index')->with('message', 'Mascota creada exitosamente.');
    }
    public function destroy($id)
    {
        $mascota = Mascota::where('id', $id)->where('usuario_id', auth()->id())->firstOrFail();
        $mascota->delete();
        return redirect()->route('mascotas.index')->with('message', 'Mascota eliminada exitosamente.');
    }
    public function edit($id)
{
    // Buscamos la mascota y verificamos que pertenezca al usuario
    $mascota = Mascota::where('usuario_id', auth()->id())->findOrFail($id);

    return Inertia::render('Mascotas/Edit', [
        'mascota' => $mascota
    ]);
}
    public function update(Request $request, $id)
    {
        $mascota = Mascota::findOrFail($id);
        $validated = $request->validate([
            'nombre'           => 'required|string|max:255',
            'raza'             => 'required|string|max:255',
            'genero'           => 'required|string',
            'peso'             => 'nullable|numeric',
            'fecha_nacimiento' => 'nullable|date',
            'foto'             => 'nullable|image|max:2048', // Máximo
        ], [
            // Mensajes personalizados en español
            'nombre.required' => 'El nombre de la mascota es obligatorio.',
            'genero.required' => 'Debes seleccionar si es Macho o Hembra.',         
            'raza.required'   => 'La raza de la mascota es obligatoria.',
            'peso.numeric'    => 'El peso debe ser un número (ejemplo: 12.5).',
            'fecha_nacimiento.date' => 'La fecha de nacimiento no tiene un formato válido.',
            'foto.image'      => 'El archivo seleccionado debe ser una imagen   .',
            'foto.max'        => 'La foto no debe pesar más de 2MB.',
        ]);  
       if ($request->hasFile('foto')) {
        $path = $request->file('foto')->store('mascotas', 'public');
        $mascota->foto = $path;
    }

    // 3. Actualizar el resto de campos manualmente o con update()
    $mascota->nombre = $validated['nombre'];
    $mascota->raza = $validated['raza'];
    $mascota->genero = $validated['genero'];
    $mascota->peso = $validated['peso'];
    $mascota->fecha_nacimiento = $validated['fecha_nacimiento'];

    // 4. Guardar los cambios definitivamente
    $mascota->save();

    return redirect()->route('mascotas.index')->with('message', 'Mascota actualizada correctamente.');
    } 
}