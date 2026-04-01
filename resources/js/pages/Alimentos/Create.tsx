import { Head, useForm, Link } from '@inertiajs/react';
import { InfoIcon, Save, Utensils, PlusCircle } from 'lucide-react';

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
    { title: 'Alimentacion', href: '/alimentacion' },
    { title: 'Nuevo Alimento', href: '/alimentacion/create' },
];

export default function Create({ mascotas }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        mascota_id: '',
        nombre: '',
        marca: '',
        cantidad_diaria: '',
        notas: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post('/alimentacion', {
            onSuccess: () => console.log('Alimento registrado con éxito'),
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nuevo Alimento" />
            
            <div className='w-full max-w-2xl p-6'>
                <div className="mb-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <PlusCircle className="w-6 h-6 text-orange-600" />
                        Registrar Nuevo Alimento
                    </h2>
                    <p className="text-muted-foreground text-sm">Define el plan alimenticio para una de tus mascotas.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Alerta de Errores */}
                    {Object.keys(errors).length > 0 && (
                        <Alert variant="destructive" className="mb-4 border-red-600">
                            <InfoIcon className="h-4 w-4" />
                            <AlertTitle>Error de validación</AlertTitle>
                            <AlertDescription>
                                Por favor, completa los campos requeridos correctamente.
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Selección de Mascota */}
                    <div className='grid gap-2'>
                        <Label htmlFor="mascota_id">Mascota:</Label>
                        <Select onValueChange={(value) => setData('mascota_id', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="¿A qué mascota pertenece este alimento?" />
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
                                placeholder="Ej: Pro Plan Cachorros" 
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
                                placeholder="Ej: Purina" 
                                value={data.marca} 
                                onChange={(e) => setData('marca', e.target.value)} 
                            />
                            {errors.marca && <p className="text-red-500 text-xs">{errors.marca}</p>}
                        </div>
                    </div>

                    {/* Cantidad Diaria */}
                    <div className='grid gap-2'>
                        <Label htmlFor="cantidad_diaria" className="flex items-center gap-2">
                            <Utensils className="w-4 h-4 text-orange-500" /> Porción Diaria Sugerida:
                        </Label>
                        <Input 
                            id="cantidad_diaria"
                            placeholder="Ej: 150g en la mañana y 150g en la noche" 
                            value={data.cantidad_diaria} 
                            onChange={(e) => setData('cantidad_diaria', e.target.value)} 
                        />
                        {errors.cantidad_diaria && <p className="text-red-500 text-xs">{errors.cantidad_diaria}</p>}
                    </div>

                    <div className="flex gap-4 pt-2">
                        <Button disabled={processing} type="submit" className="bg-orange-600 hover:bg-orange-700 flex-1">
                            <Save className="w-4 h-4 mr-2" />
                            {processing ? 'Registrando...' : 'Registrar Alimento'}
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