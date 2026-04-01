import { Head, useForm, Link } from '@inertiajs/react';
import { InfoIcon, Save, Camera, PlusCircle, X } from 'lucide-react';
import { useState, useEffect } from 'react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';




interface Mascota {
    id: number;
    nombre: string;
}

interface Props {
    mascotas: Mascota[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Momentos', href: '/momentos' },
    { title: 'Nuevo Recuerdo', href: '/momentos/create' },
];

export default function Create({ mascotas }: Props) {
    const [preview, setPreview] = useState<string | null>(null);

    const { data, setData, post, processing, errors } = useForm({
        mascota_id: '',
        foto: null as File | null,
        anecdota: '',
        fecha_creacion: new Date().toISOString().split('T')[0],
    });

    useEffect(() => {
    let objectUrl: string | null = null;

    const frameId = requestAnimationFrame(() => {
        if (!data.foto) {
            setPreview((current) => (current !== null ? null : current));
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
}, [data.foto]);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        post('/momentos', {
            onSuccess: () => console.log('Recuerdo inmortalizado'),
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nuevo Recuerdo" />
            
            <div className='w-full max-w-2xl p-6'>
                <div className="mb-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <PlusCircle className="w-6 h-6 text-indigo-600" />
                        Inmortalizar un Momento
                    </h2>
                    <p className="text-muted-foreground text-sm">Sube una foto y cuenta la historia detrás de ella.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {Object.keys(errors).length > 0 && (
                        <Alert variant="destructive" className="mb-4 border-red-600">
                            <InfoIcon className="h-4 w-4" />
                            <AlertTitle>Faltan detalles</AlertTitle>
                            <AlertDescription>Asegúrate de subir una foto y seleccionar a tu mascota.</AlertDescription>
                        </Alert>
                    )}

                    {/* Selector de Mascota */}
                    <div className='grid gap-2'>
                        <Label htmlFor="mascota_id">¿Quién es el protagonista?</Label>
                        <Select onValueChange={(value) => setData('mascota_id', value)}>
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
                        {!preview ? (
                            <div className="border-2 border-dashed border-muted-foreground/20 rounded-xl p-8 flex flex-col items-center justify-center bg-secondary/10 hover:bg-secondary/20 transition-colors cursor-pointer relative">
                                <Camera className="w-10 h-10 text-muted-foreground mb-2" />
                                <span className="text-sm text-muted-foreground">Haz clic para seleccionar una imagen</span>
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={(e) => setData('foto', e.target.files?.[0] || null)}
                                />
                            </div>
                        ) : (
                            <div className="relative rounded-xl overflow-hidden border bg-black">
                                <img src={preview} alt="Vista previa" className="w-full max-h-80 object-contain mx-auto" />
                                <Button 
                                    type="button"
                                    variant="destructive" 
                                    size="icon" 
                                    className="absolute top-2 right-2 rounded-full h-8 w-8"
                                    onClick={() => setData('foto', null)}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        )}
                        {errors.foto && <p className="text-red-500 text-xs">{errors.foto}</p>}
                    </div>

                    {/* Anecdota */}
                    <div className='grid gap-2'>
                        <Label htmlFor="anecdota">La Historia / Anécdota:</Label>
                        <Textarea 
                            id="anecdota"
                            placeholder="¿Qué estaba pasando en ese momento?..." 
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
                            {processing ? 'Subiendo recuerdo...' : 'Guardar en el álbum'}
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