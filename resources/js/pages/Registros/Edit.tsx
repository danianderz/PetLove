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
import { Switch } from '@/components/ui/switch';
import { InfoIcon, Save, Stethoscope } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface Mascota {
    id: number;
    nombre: string;
}

interface RegistroMedico {
    id: number;
    mascota_id: number;
    tipo: string;
    titulo: string;
    descripcion: string;
    fecha_cita: string;
    completado: boolean;
}

interface Props {
    registro: RegistroMedico;
    mascotas: Mascota[];
}

export default function Edit({ registro, mascotas }: Props) {
    // Definimos el formulario con los datos actuales del registro
    const { data, setData, put, processing, errors } = useForm({
        mascota_id: registro.mascota_id.toString(),
        tipo: registro.tipo || 'Chequeo',
        titulo: registro.titulo || '',
        descripcion: registro.descripcion || '',
        fecha_cita: registro.fecha_cita ? registro.fecha_cita.slice(0, 16) : '', // Formato YYYY-MM-DDTHH:mm
        completado: Boolean(registro.completado),
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Registros Médicos', href: '/registros' },
        { title: 'Editar Registro', href: `/registros/${registro.id}/edit` },
    ];

    function handleUpdate(e: React.FormEvent) {
        e.preventDefault();
        // Usamos PUT para actualizar
        put(`/registros/${registro.id}`, {
            onSuccess: () => console.log('Registro actualizado'),
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Editar Registro Médico" />
            
            <div className='w-full max-w-2xl p-6'>
                <div className="mb-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Stethoscope className="w-6 h-6 text-blue-600" />
                        Editar Registro Médico
                    </h2>
                    <p className="text-muted-foreground text-sm">Ingresa los detalles de la atención o cita médica.</p>
                </div>
                <form onSubmit={handleUpdate} className="space-y-6">
                    {/* Alerta de Errores */}
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
                        <Select 
                            defaultValue={data.mascota_id} 
                            onValueChange={(value) => setData('mascota_id', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona la mascota" />
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
                        {/* Tipo */}
                        <div className='grid gap-2'>
                            <Label htmlFor="tipo">Tipo de atención:</Label>
                            <Select defaultValue={data.tipo} onValueChange={(value) => setData('tipo', value)}>
                                <SelectTrigger>
                                    <SelectValue />
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

                        {/* Fecha */}
                        <div className='grid gap-2'>
                            <Label htmlFor="fecha_cita">Fecha y Hora:</Label>
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
                            value={data.titulo} 
                            onChange={(e) => setData('titulo', e.target.value)} 
                        />
                        {errors.titulo && <p className="text-red-500 text-xs">{errors.titulo}</p>}
                    </div>

                    {/* Descripción */}
                    <div className='grid gap-2'>
                        <Label htmlFor="descripcion">Observaciones / Descripción:</Label>
                        <Textarea 
                            rows={4}
                            value={data.descripcion} 
                            onChange={(e) => setData('descripcion', e.target.value)} 
                        />
                    </div>

                    {/* Switch de Estado */}
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
                            <Save className="w-4 h-4 mr-2" /> {processing ? 'Guardando...' : 'Guardar Cambios'}
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