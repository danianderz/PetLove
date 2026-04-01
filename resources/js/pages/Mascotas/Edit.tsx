import { Head, Link, useForm } from '@inertiajs/react';
import { ImageIcon, InfoIcon, Weight, Calendar, Save, Pencil, Camera } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import AppLayout from '@/layouts/app-layout';
import { update } from '@/routes/mascotas';
import { type BreadcrumbItem } from '@/types';




interface Mascota {
    id: number;
    nombre: string;
    raza: string;
    foto: string | null;
    fecha_nacimiento: string;
    peso: string;
    genero: string;
    usuario_id: number;
}

interface Props {
    mascota: Mascota;
}

export default function Edit({ mascota }: Props) {
    const [preview, setPreview] = useState<string | null>(null);
    const hoy = new Date().toISOString().split("T")[0];
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Mascotas', href: '/mascotas' },
        { title: 'Editar Mascota', href: `/mascotas/${mascota.id}/edit` },
    ];

    const { data, setData, post, processing, errors } = useForm({
        _method: 'put',
        nombre: mascota.nombre || '',
        raza: mascota.raza || '',
        foto: null as File | null,
        fecha_nacimiento: mascota.fecha_nacimiento || '',
        peso: mascota.peso || '',
        genero: mascota.genero || 'Macho',
    });

    useEffect(() => {
    let objectUrl: string | null = null;

    const frameId = requestAnimationFrame(() => {
        if (!data.foto) {
            const originalPath = `/storage/${mascota.foto}`;
            setPreview((current) => (current !== originalPath ? originalPath : current));
        } else {
            objectUrl = URL.createObjectURL(data.foto);
            setPreview((current) => (current !== objectUrl ? objectUrl : current));
        }
    });

    return () => {
        cancelAnimationFrame(frameId);
        if (objectUrl) {
            URL.revokeObjectURL(objectUrl);
        }
    };
}, [data.foto, mascota.foto]); 

    function handleUpdate(e: React.FormEvent) {
        e.preventDefault();
        post(update(mascota.id).url, {
            forceFormData: true,
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Editar ${mascota.nombre}`} />

            <div className='w-full max-w-2xl p-6'>

                <div className="mb-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Pencil className="w-6 h-6 text-yellow-500" />
                        Editar Mascota: {mascota.nombre}
                    </h2>
                    <p className="text-muted-foreground text-sm">Modifica los datos de tu mascota en el sistema.</p>
                </div>

                <form onSubmit={handleUpdate} className="space-y-6">
                    {/* Alerta de Errores */}
                    {Object.keys(errors).length > 0 && (
                        <Alert variant="destructive" className="mb-4 border-red-600">
                            <InfoIcon className="h-4 w-4" />
                            <AlertTitle>Error de validación</AlertTitle>
                            <AlertDescription>
                                Revisa los campos marcados para continuar.
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Fila de Nombre y Raza */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className='grid gap-2'>
                            <Label htmlFor="nombre">Nombre:</Label>
                            <Input
                                id="nombre"
                                placeholder="Ej: Max, Luna..."
                                value={data.nombre}
                                onChange={(e) => setData('nombre', e.target.value)}
                            />
                            {errors.nombre && <p className="text-red-500 text-xs">{errors.nombre}</p>}
                        </div>

                        <div className='grid gap-2'>
                            <Label htmlFor="raza">Raza:</Label>
                            <Input
                                id="raza"
                                placeholder="Ej: Golden Retriever"
                                value={data.raza}
                                onChange={(e) => setData('raza', e.target.value)}
                            />
                            {errors.raza && <p className="text-red-500 text-xs">{errors.raza}</p>}
                        </div>
                    </div>

                    {/* Fila de Fecha y Peso */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className='grid gap-2'>
                            <Label htmlFor="fecha_nacimiento" className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-yellow-500" /> Fecha de Nacimiento:
                            </Label>
                            <Input
                                id="fecha_nacimiento"
                                type="date"
                                max={hoy}
                                value={data.fecha_nacimiento}
                                onChange={(e) => setData('fecha_nacimiento', e.target.value)}
                            />
                        </div>

                        <div className='grid gap-2'>
                            <Label htmlFor="peso" className="flex items-center gap-2">
                                <Weight className="w-4 h-4 text-yellow-500" /> Peso (kg):
                            </Label>
                            <Input
                                id="peso"
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={data.peso}
                                onChange={(e) => setData('peso', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Género */}
                    <div className="grid gap-3 p-4 rounded-lg border bg-slate-50 dark:bg-zinc-900/50">
                        <Label className="font-medium">Género:</Label>
                        <RadioGroup
                            value={data.genero}
                            onValueChange={(value) => setData('genero', value)}
                            className="flex gap-8"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Macho" id="macho" />
                                <Label htmlFor="macho" className="font-normal cursor-pointer">Macho</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Hembra" id="hembra" />
                                <Label htmlFor="hembra" className="font-normal cursor-pointer">Hembra</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {/* Foto de Perfil de la Mascota */}
                    <div className='grid gap-2'>
                        <Label htmlFor="foto" className="flex items-center gap-2">
                            <ImageIcon className="w-4 h-4 text-yellow-500" /> Foto de la mascota:
                        </Label>

                        <div className="flex flex-col items-center justify-center space-y-4">
                            {!preview ? (
                                /* ESTADO: SIN FOTO (Círculo punteado) */
                                <div className="w-40 h-40 border-2 border-dashed border-muted-foreground/20 rounded-full flex flex-col items-center justify-center bg-secondary/10 hover:bg-secondary/20 transition-colors cursor-pointer relative overflow-hidden">
                                    <Camera className="w-8 h-8 text-muted-foreground mb-1" />
                                    <span className="text-[10px] text-center px-4 text-muted-foreground uppercase font-semibold">Subir Foto</span>
                                    <input
                                        type="file"
                                        id="foto"
                                        accept="image/*"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={(e) => setData('foto', e.target.files?.[0] || null)}
                                    />
                                </div>
                            ) : (
                                /* ESTADO: CON PREVIEW (Estilo Momentos) */
                                <div className="relative group w-40 h-40">
                                    <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-lg bg-secondary relative">
                                        <img
                                            src={preview}
                                            alt="Vista previa mascota"
                                            className="w-full h-full object-cover"
                                        />

                                        {/* Overlay oscuro y Botón "Cambiar Foto" (Se muestra al hacer hover o siempre) */}
                                        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/30">
                                                <Camera className="w-4 h-4 text-white" />
                                                <span className="text-[10px] text-white font-bold uppercase">Cambiar Foto</span>
                                            </div>
                                        </div>

                                        {/* Input invisible que cubre TODO el círculo */}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="absolute inset-0 opacity-0 cursor-pointer z-30"
                                            onChange={(e) => setData('foto', e.target.files?.[0] || null)}
                                        />
                                    </div>
                                </div>
                            )}

                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest text-center">
                                JPG, PNG. Máx 2MB.
                            </p>
                        </div>

                        {errors.foto && <p className="text-red-500 text-xs mt-1 text-center">{errors.foto}</p>}
                    </div>
                    {/* Botones */}
                    <div className="flex gap-4">
                        <Button
                            disabled={processing}
                            type="submit"
                            className="bg-yellow-500 hover:bg-yellow-600 flex-1"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            {processing ? 'Actualizando...' : 'Guardar Cambios'}
                        </Button>
                        <Link href="/mascotas" className="flex-1">
                            <Button variant="outline" type="button" className="w-full">
                                Cancelar
                            </Button>
                        </Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}