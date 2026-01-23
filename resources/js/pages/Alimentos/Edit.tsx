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
import { InfoIcon, Save, Utensils, Pencil } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface Mascota {
    id: number;
    nombre: string;
}

interface Alimento {
    id: number;
    mascota_id: number;
    nombre: string;
    marca: string;
    cantidad_diaria: string;
    notas: string | null;
}

interface Props {
    alimento: Alimento;
    mascotas: Mascota[];
}

export default function Edit({ alimento, mascotas }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        mascota_id: alimento.mascota_id.toString(),
        nombre: alimento.nombre || '',
        marca: alimento.marca || '',
        cantidad_diaria: alimento.cantidad_diaria || '',
        notas: alimento.notas || '',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Alimentacion', href: '/alimentacion' },
        { title: 'Editar Alimento', href: `/alimentacion/${alimento.id}/edit` },
    ];

    function handleUpdate(e: React.FormEvent) {
        e.preventDefault();
        put(`/alimentacion/${alimento.id}`, {
            onSuccess: () => console.log('Plan de alimentación actualizado'),
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Editar Alimento" />
            
            <div className='w-full max-w-2xl p-6'>
                <div className="mb-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Pencil className="w-6 h-6 text-orange-500" />
                        Editar Plan de Alimentación
                    </h2>
                    <p className="text-muted-foreground text-sm">Actualiza la dieta y porciones de tu mascota.</p>
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
                        {/* Nombre del Alimento */}
                        <div className='grid gap-2'>
                            <Label htmlFor="nombre">Nombre del Alimento:</Label>
                            <Input 
                                id="nombre"
                                placeholder="Ej: Croquetas Adulto"
                                value={data.nombre} 
                                onChange={(e) => setData('nombre', e.target.value)} 
                            />
                            {errors.nombre && <p className="text-red-500 text-xs">{errors.nombre}</p>}
                        </div>

                        {/* Marca */}
                        <div className='grid gap-2'>
                            <Label htmlFor="marca">Marca:</Label>
                            <Input 
                                id="marca"
                                placeholder="Ej: Royal Canin"
                                value={data.marca} 
                                onChange={(e) => setData('marca', e.target.value)} 
                            />
                            {errors.marca && <p className="text-red-500 text-xs">{errors.marca}</p>}
                        </div>
                    </div>

                    {/* Cantidad Diaria */}
                    <div className='grid gap-2'>
                        <Label htmlFor="cantidad_diaria" className="flex items-center gap-2">
                            <Utensils className="w-4 h-4 text-orange-500" /> Cantidad Diaria / Porción:
                        </Label>
                        <Input 
                            id="cantidad_diaria"
                            placeholder="Ej: 200g dos veces al día"
                            value={data.cantidad_diaria} 
                            onChange={(e) => setData('cantidad_diaria', e.target.value)} 
                        />
                        {errors.cantidad_diaria && <p className="text-red-500 text-xs">{errors.cantidad_diaria}</p>}
                    </div>
                  

                    <div className="flex gap-4 pt-2">
                        <Button disabled={processing} type="submit" className="bg-orange-600 hover:bg-orange-700 flex-1">
                            <Save className="w-4 h-4 mr-2" /> {processing ? 'Guardando...' : 'Guardar Cambios'}
                        </Button>
                        <Link href="/alimentacion" className="flex-1">
                            <Button variant="outline" type="button" className="w-full">Cancelar</Button>
                        </Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}