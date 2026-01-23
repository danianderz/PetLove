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
import { InfoIcon, Save, Wallet, Pencil, Calendar } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface Mascota {
    id: number;
    nombre: string;
}

interface Gasto {
    id: number;
    mascota_id: number;
    categoria: string;
    monto: number;
    descripcion: string | null;
    fecha: string;
}

interface Props {
    gasto: Gasto;
    mascotas: Mascota[];
}

export default function Edit({ gasto, mascotas }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        mascota_id: gasto.mascota_id.toString(),
        categoria: gasto.categoria || '',
        monto: gasto.monto.toString(),
        descripcion: gasto.descripcion || '',
        fecha: gasto.fecha || '',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Gastos', href: '/gastos' },
        { title: 'Editar Gasto', href: `/gastos/${gasto.id}/edit` },
    ];

    function handleUpdate(e: React.FormEvent) {
        e.preventDefault();
        put(`/gastos/${gasto.id}`, {
            onSuccess: () => console.log('Gasto actualizado correctamente'),
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Editar Gasto" />
            
            <div className='w-full max-w-2xl p-6'>
                <div className="mb-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Pencil className="w-6 h-6 text-emerald-500" />
                        Editar Registro de Gasto
                    </h2>
                    <p className="text-muted-foreground text-sm">Modifica los detalles del gasto realizado.</p>
                </div>

                <form onSubmit={handleUpdate} className="space-y-6">
                    {/* Alerta de Errores */}
                    {Object.keys(errors).length > 0 && (
                        <Alert variant="destructive" className="mb-4 border-red-600">
                            <InfoIcon className="h-4 w-4" />
                            <AlertTitle>Error de validación</AlertTitle>
                            <AlertDescription>
                                Revisa los datos ingresados e intenta nuevamente.
                            </AlertDescription>
                        </Alert>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Selección de Mascota */}
                        <div className='grid gap-2'>
                            <Label htmlFor="mascota_id">Mascota asociada:</Label>
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

                        {/* Categoría */}
                        <div className='grid gap-2'>
                            <Label htmlFor="categoria">Categoría:</Label>
                            <Select 
                                defaultValue={data.categoria} 
                                onValueChange={(value) => setData('categoria', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Tipo de gasto" />
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
                            <Label htmlFor="monto">Monto ($):</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                                <Input 
                                    id="monto"
                                    type="number"
                                    step="0.01"
                                    className="pl-7"
                                    placeholder="0.00"
                                    value={data.monto} 
                                    onChange={(e) => setData('monto', e.target.value)} 
                                />
                            </div>
                            {errors.monto && <p className="text-red-500 text-xs">{errors.monto}</p>}
                        </div>

                        {/* Fecha */}
                        <div className='grid gap-2'>
                            <Label htmlFor="fecha" className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-emerald-500" /> Fecha del Gasto:
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
                        <Label htmlFor="descripcion">Descripción / Notas adicionales:</Label>
                        <Textarea 
                            id="descripcion"
                            placeholder="Ej: Compra de bulto de 10kg de comida..."
                            rows={3}
                            value={data.descripcion} 
                            onChange={(e) => setData('descripcion', e.target.value)} 
                        />
                        {errors.descripcion && <p className="text-red-500 text-xs">{errors.descripcion}</p>}
                    </div>

                    <div className="flex gap-4 pt-2">
                        <Button disabled={processing} type="submit" className="bg-emerald-600 hover:bg-emerald-700 flex-1 text-white">
                            <Save className="w-4 h-4 mr-2" /> {processing ? 'Actualizando...' : 'Actualizar Gasto'}
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