import { Head, useForm, Link } from '@inertiajs/react';
import { Calendar, InfoIcon, PlusCircle, Save, Stethoscope } from 'lucide-react';

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
import { Switch } from '@/components/ui/switch'; // Para el campo 'completado'
import { Textarea } from '@/components/ui/textarea'; // Asumiendo que tienes este componente de Shadcn
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

interface Mascota {
    id: number;
    nombre: string;
}

interface Props {
    mascotas: Mascota[]; // Recibimos las mascotas del controlador
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Registros Médicos', href: '/registros' },
    { title: 'Nuevo Registro', href: '/registros/create' },
];

export default function Create({ mascotas }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        mascota_id: '',
        tipo: 'Chequeo',
        titulo: '',
        descripcion: '',
        fecha_cita: '',
        completado: false,
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post('/registros', {
            onSuccess: () => console.log('Registro creado'),
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nuevo Registro Médico" />
            
            <div className='w-full max-w-2xl p-6'>
                <div className="mb-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <PlusCircle className="w-6 h-6 text-blue-600" />
                        Crear Registro Médico
                    </h2>
                    <p className="text-muted-foreground text-sm">Ingresa los detalles de la atención o cita médica.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {Object.keys(errors).length > 0 && (
                        <Alert variant="destructive" className="mb-4 border-red-600">
                            <InfoIcon className="h-4 w-4" />
                            <AlertTitle>Error de validación</AlertTitle>
                            <AlertDescription>
                                Revisa los campos marcados en rojo.
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Selección de Mascota */}
                    <div className='grid gap-2'>
                        <Label htmlFor="mascota_id">Mascota:</Label>
                        <Select onValueChange={(value) => setData('mascota_id', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona una mascota" />
                            </SelectTrigger>
                            <SelectContent>
                                {mascotas.map((m) => (
                                    <SelectItem key={m.id} value={m.id.toString()}>
                                        {m.nombre}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.mascota_id && <p className="text-red-500 text-xs">{errors.mascota_id}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Tipo de Registro */}
                        <div className='grid gap-2'>
                            <Label htmlFor="fecha" className="flex items-center gap-2">
                                <Stethoscope className="w-4 h-4 text-blue-600" /> Tipo de atención:
                            </Label>
                            <Select defaultValue={data.tipo} onValueChange={(value) => setData('tipo', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Chequeo">Chequeo General</SelectItem>
                                    <SelectItem value="Vacuna">Vacunación</SelectItem>
                                    <SelectItem value="Cirugia">Cirugía</SelectItem>
                                    <SelectItem value="Emergencia">Emergencia</SelectItem>
                                    <SelectItem value="Otro">Otro</SelectItem>
                                </SelectContent>
                            </Select>
                            
                        </div>

                        {/* Fecha de la Cita */}
                        <div className='grid gap-2'>
                            <Label htmlFor="fecha" className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-blue-600" /> Fecha y Hora:
                            </Label>
                            <Input 
                                type="datetime-local" 
                                value={data.fecha_cita} 
                                onChange={(e) => setData('fecha_cita', e.target.value)} 
                            />
                            {errors.fecha_cita && <p className="text-red-500 text-xs">{errors.fecha_cita}</p>}
                        </div>
                    </div>

                    {/* Título */}
                    <div className='grid gap-2'>
                        <Label htmlFor="titulo">Título / Motivo:</Label>
                        <Input 
                            placeholder='Ej: Vacuna Triple Felina' 
                            value={data.titulo} 
                            onChange={(e) => setData('titulo', e.target.value)} 
                        />
                        {errors.titulo && <p className="text-red-500 text-xs">{errors.titulo}</p>}
                    </div>

                    {/* Descripción */}
                    <div className='grid gap-2'>
                        <Label htmlFor="descripcion">Observaciones / Descripción:</Label>
                        <Textarea 
                            placeholder='Detalles de la consulta, medicamentos recetados, etc.' 
                            rows={4}
                            value={data.descripcion} 
                            onChange={(e) => setData('descripcion', e.target.value)} 
                        />
                    </div>

                    {/* Estado Completado */}
                    <div className="flex items-center space-x-2 border p-3 rounded-lg bg-slate-50 dark:bg-zinc-900">
                        <Switch 
                            id="completado"
                            checked={data.completado}
                            onCheckedChange={(checked) => setData('completado', checked)}
                        />
                        <Label htmlFor="completado" className="cursor-pointer">¿La cita ya fue completada?</Label>
                    </div>

                    <div className="flex gap-4">
                        <Button disabled={processing} type="submit" className="bg-blue-600 hover:bg-blue-700 flex-1">
                            <Save className="w-4 h-4 mr-2" />
                            {processing ? 'Guardando...' : 'Guardar Registro'}
                        </Button>
                        <Link href="/registros" className="flex-1">
                            <Button variant="outline" type="button" className="w-full">Cancelar</Button>
                        </Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}