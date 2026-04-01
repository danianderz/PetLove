import { Head, useForm, Link } from '@inertiajs/react';
import { InfoIcon, Save, Wallet, PlusCircle, Calendar } from 'lucide-react';

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
    { title: 'Gastos', href: '/gastos' },
    { title: 'Nuevo Gasto', href: '/gastos/create' },
];

export default function Create({ mascotas }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        mascota_id: '',
        categoria: '',
        monto: '',
        descripcion: '',
        fecha: new Date().toISOString().split('T')[0], // Fecha de hoy por defecto
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post('/gastos', {
            onSuccess: () => console.log('Gasto registrado con éxito'),
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nuevo Gasto" />
            
            <div className='w-full max-w-2xl p-6'>
                <div className="mb-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <PlusCircle className="w-6 h-6 text-emerald-600" />
                        Registrar Nuevo Gasto
                    </h2>
                    <p className="text-muted-foreground text-sm">Lleva el control de los egresos destinados a tus mascotas.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Alerta de Errores */}
                    {Object.keys(errors).length > 0 && (
                        <Alert variant="destructive" className="mb-4 border-red-600">
                            <InfoIcon className="h-4 w-4" />
                            <AlertTitle>Error de validación</AlertTitle>
                            <AlertDescription>
                                Por favor, revisa los campos obligatorios marcados en rojo.
                            </AlertDescription>
                        </Alert>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Selección de Mascota */}
                        <div className='grid gap-2'>
                            <Label htmlFor="mascota_id">Mascota:</Label>
                            <Select onValueChange={(value) => setData('mascota_id', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="¿Para qué mascota?" />
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

                        {/* Categoría */}
                        <div className='grid gap-2'>
                            <Label htmlFor="categoria">Categoría:</Label>
                            <Select onValueChange={(value) => setData('categoria', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona el tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Alimentación">Alimentación</SelectItem>
                                    <SelectItem value="Salud">Salud / Veterinaria</SelectItem>
                                    <SelectItem value="Higiene">Higiene / Estética</SelectItem>
                                    <SelectItem value="Juguetes">Juguetes / Accesorios</SelectItem>
                                    <SelectItem value="Otros">Otros</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.categoria && <p className="text-red-500 text-xs">{errors.categoria}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Monto */}
                        <div className='grid gap-2'>
                            <Label htmlFor="monto" className="flex items-center gap-2">
                                <Wallet className="w-4 h-4 text-emerald-500" /> Monto ($):
                            </Label>
                            <Input 
                                id="monto"
                                type="number"
                                step="0.01"
                                placeholder="Ej: 45.50" 
                                value={data.monto} 
                                onChange={(e) => setData('monto', e.target.value)} 
                            />
                            {errors.monto && <p className="text-red-500 text-xs">{errors.monto}</p>}
                        </div>

                        {/* Fecha */}
                        <div className='grid gap-2'>
                            <Label htmlFor="fecha" className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-emerald-500" /> Fecha:
                            </Label>
                            <Input 
                                id="fecha"
                                type="date"
                                value={data.fecha} 
                                onChange={(e) => setData('fecha', e.target.value)} 
                            />
                            {errors.fecha && <p className="text-red-500 text-xs">{errors.fecha}</p>}
                        </div>
                    </div>

                    {/* Descripción */}
                    <div className='grid gap-2'>
                        <Label htmlFor="descripcion">Descripción / Notas:</Label>
                        <Textarea 
                            id="descripcion"
                            placeholder="Ej: Vacunación anual y desparasitación..." 
                            rows={3}
                            value={data.descripcion} 
                            onChange={(e) => setData('descripcion', e.target.value)} 
                        />
                        {errors.descripcion && <p className="text-red-500 text-xs">{errors.descripcion}</p>}
                    </div>

                    <div className="flex gap-4 pt-2">
                        <Button disabled={processing} type="submit" className="bg-emerald-600 hover:bg-emerald-700 flex-1 text-white">
                            <Save className="w-4 h-4 mr-2" />
                            {processing ? 'Registrando...' : 'Registrar Gasto'}
                        </Button>
                        <Link href="/gastos" className="flex-1">
                            <Button variant="outline" type="button" className="w-full">Cancelar</Button>
                        </Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}