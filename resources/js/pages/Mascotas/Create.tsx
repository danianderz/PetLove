import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ImageIcon, InfoIcon, Weight, Calendar, PawPrint, Save, PlusCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Mascotas', href: '/mascotas' },
    { title: 'Añadir Mascota', href: '/mascotas/create' },
];

export default function Create() {
    const hoy = new Date().toISOString().split("T")[0];
    const { data, setData, post, errors, processing } = useForm({
        nombre: '',
        raza: '',
        foto: null as File | null,
        fecha_nacimiento: '',
        peso: '',
        genero: 'Macho',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        // Usamos la URL directa o route si está disponible
        post('/mascotas', {
            forceFormData: true,
            onSuccess: () => console.log('Mascota guardada'),
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Añadir Mascota" />
            <div className='w-full max-w-2xl p-6'>
                
                <div className="mb-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                         <PlusCircle className="w-6 h-6 text-yellow-500"/>
                        Registrar Nueva Mascota
                    </h2>
                    <p className="text-muted-foreground text-sm">Registra los datos básicos de tu nuevo compañero.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Alerta de Errores con estilo destructivo */}
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
                                <Calendar className="w-4 h-4" /> Fecha de Nacimiento:
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
                                <Weight className="w-4 h-4" /> Peso (kg):
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

                    {/* Género con el contenedor sutil de Registros */}
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

                    {/* Foto de Perfil */}
                    <div className='grid gap-2'>
                        <Label htmlFor="foto" className="flex items-center gap-2">
                            <ImageIcon className="w-4 h-4" /> Foto de la mascota:
                        </Label>
                        <Input 
                            id="foto"
                            type="file" 
                            className="cursor-pointer"
                            onChange={(e) => setData('foto', e.target.files ? e.target.files[0] : null)} 
                        />
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest">JPG, PNG. Máx 2MB.</p>
                    </div>

                    <div className="flex gap-4">
                        <Button 
                            disabled={processing} 
                            type="submit" 
                            className="bg-yellow-500 hover:bg-yellow-600 flex-1"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            {processing ? 'Guardando...' : 'Guardar Mascota'}
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