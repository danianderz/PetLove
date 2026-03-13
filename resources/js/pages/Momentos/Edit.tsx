import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";
import { InfoIcon, Save, Camera, Pencil, X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useState, useEffect } from 'react';
import { update } from '@/routes/momentos';

interface Mascota {
    id: number;
    nombre: string;
}

interface Momento {
    id: number;
    mascota_id: number;
    anecdota: string;
    ruta_foto: string;
    fecha_creacion: string;
}

interface Props {
    mascotas: Mascota[];
    momento: Momento;
}

export default function Edit({ mascotas, momento }: Props) {
    const [preview, setPreview] = useState<string | null>(`/storage/${momento.ruta_foto}`);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Momentos', href: '/momentos' },
        { title: 'Editar Recuerdo', href: `/momentos/${momento.id}/edit` },
    ];

    const { data, setData, post, processing, errors } = useForm({
        _method: 'put', 
        mascota_id: momento.mascota_id.toString(),
        foto: null as File | null,
        anecdota: momento.anecdota,
        fecha_creacion: momento.fecha_creacion.split(' ')[0], 
    });

    // Manejar previsualización
    useEffect(() => {
        if (!data.foto) {

            setPreview(`/storage/${momento.ruta_foto}`);
            return;
        }
        const objectUrl = URL.createObjectURL(data.foto);
        setPreview(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [data.foto]);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        post(update(momento.id).url, {
                    forceFormData: true,
                });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Editar Recuerdo" />
            
            <div className='w-full max-w-2xl p-6'>
                <div className="mb-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Pencil className="w-6 h-6 text-indigo-600" />
                        Editar este Momento
                    </h2>
                    <p className="text-muted-foreground text-sm">¿Quieres ajustar la historia o cambiar la foto?</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {Object.keys(errors).length > 0 && (
                        <Alert variant="destructive" className="mb-4 border-red-600">
                            <InfoIcon className="h-4 w-4" />
                            <AlertTitle>Hay errores</AlertTitle>
                            <AlertDescription>Revisa los campos marcados en rojo abajo.</AlertDescription>
                        </Alert>
                    )}

                    {/* Selector de Mascota */}
                    <div className='grid gap-2'>
                        <Label htmlFor="mascota_id">El protagonista</Label>
                        <Select 
                            defaultValue={data.mascota_id} 
                            onValueChange={(value) => setData('mascota_id', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona una mascota" />
                            </SelectTrigger>
                            <SelectContent>
                                {mascotas.map((m) => (
                                    <SelectItem key={m.id} value={m.id.toString()}>{m.nombre}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.mascota_id && <p className="text-red-500 text-xs">{errors.mascota_id}</p>}
                    </div>

                    {/* Subida de Foto con Preview */}
                    <div className='grid gap-2'>
                        <Label>Foto:</Label>
                        <div className="relative rounded-xl overflow-hidden border bg-black group">
                            <img src={preview || ''} alt="Vista previa" className="w-full max-h-80 object-contain mx-auto" />
                            
                            {/* Botón para cambiar foto sobre la imagen */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Button type="button" variant="secondary" className="relative cursor-pointer">
                                    <Camera className="w-4 h-4 mr-2" />
                                    Cambiar Foto
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={(e) => setData('foto', e.target.files?.[0] || null)}
                                    />
                                </Button>
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground italic text-center">Deja la imagen como está si no deseas cambiarla.</p>
                        {errors.foto && <p className="text-red-500 text-xs">{errors.foto}</p>}
                    </div>

                    {/* Anecdota */}
                    <div className='grid gap-2'>
                        <Label htmlFor="anecdota">La Historia / Anécdota:</Label>
                        <Textarea 
                            id="anecdota"
                            placeholder="Actualiza el relato..." 
                            rows={4}
                            value={data.anecdota} 
                            onChange={(e) => setData('anecdota', e.target.value)} 
                        />
                        {errors.anecdota && <p className="text-red-500 text-xs">{errors.anecdota}</p>}
                    </div>

                    {/* Fecha */}
                    <div className='grid gap-2'>
                        <Label htmlFor="fecha_creacion">Fecha del recuerdo:</Label>
                        <Input 
                            id="fecha_creacion"
                            type="date"
                            value={data.fecha_creacion} 
                            onChange={(e) => setData('fecha_creacion', e.target.value)} 
                        />
                    </div>

                    <div className="flex gap-4 pt-2">
                        <Button disabled={processing} type="submit" className="bg-indigo-600 hover:bg-indigo-700 flex-1 text-white">
                            <Save className="w-4 h-4 mr-2" />
                            {processing ? 'Actualizando...' : 'Guardar Cambios'}
                        </Button>
                        <Link href="/momentos" className="flex-1">
                            <Button variant="outline" type="button" className="w-full">Cancelar</Button>
                        </Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}