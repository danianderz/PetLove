import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from '@inertiajs/react'
import { route } from 'ziggy-js';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import mascotas, { store } from '@/routes/mascotas';
import { InfoIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Añadir Mascotas',
        href: '/mascotas/create',
    },
];

export default function Index() {
    const hoy = new Date().toISOString().split("T")[0];
    const { data, setData, post, errors } = useForm({
        nombre: '',
        raza: '',
        foto: null as File | null,
        fecha_nacimiento: '',
        peso: '',
        genero: 'Macho',
    });


    function handleSumit(e: React.FormEvent) {
        e.preventDefault();

        // Los datos del estado 'data' se envían automáticamente.
        post(store().url, {
            forceFormData: true, // Importante para que la 'foto' se envíe correctamente
            onSuccess: () => console.log('Mascota guardada'),
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Añadir Mascotas" />
            <div className='w-8/12 p-4'>
                <form onSubmit={handleSumit} className="space-y-4">
                    {/*Display error*/}
                    {Object.keys(errors).length > 0 && (
                        <Alert>
                            <InfoIcon />
                            <AlertTitle>Error!</AlertTitle>
                            <AlertDescription>
                                <ul>
                                    {Object.entries(errors).map(([key, message]) => (
                                        <li key={key}>{message as string}</li>
                                    ))}
                                </ul>
                            </AlertDescription>
                        </Alert>
                    )}
                    <div className='gap-1.5'>
                        <Label htmlFor="nombre">Nombre:</Label>
                        <Input placeholder='Nombre de la mascota' value={data.nombre} onChange={(e) => setData('nombre', e.target.value)} />
                    </div>

                    <div className='gap-1.5'>
                        <Label htmlFor="raza">Raza:</Label>
                        <Input placeholder='Raza de la mascota' value={data.raza} onChange={(e) => setData('raza', e.target.value)} />
                    </div>

                    <div className='gap-1.5'>
                        <Label htmlFor="foto">Foto:</Label>
                        <Input type="file" onChange={(e) => setData('foto', e.target.files ? e.target.files[0] : null)} />
                    </div>

                    <div className='gap-1.5'>
                        <Label htmlFor="fecha_nacimiento">Fecha de Nacimiento:</Label>
                        <Input
                            type="date"
                            max={hoy}
                            value={data.fecha_nacimiento}
                            onChange={(e) => setData('fecha_nacimiento', e.target.value)}
                        />
                    </div>

                    <div className='gap-1.5'>
                        <Label htmlFor="peso">Peso:</Label>
                        <Input type="number" step="0.01" placeholder='Peso en kg' value={data.peso} onChange={(e) => setData('peso', e.target.value)} />
                    </div>

                    <div className='grid gap-3'>
                        <Label>Género:</Label>
                        <RadioGroup
                            value={data.genero}
                            onValueChange={(value) => setData('genero', value)}
                            className="flex gap-6 mt-1"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Macho" id="r1" />
                                <Label htmlFor="r1" className="font-normal cursor-pointer">Macho</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Hembra" id="r2" />
                                <Label htmlFor="r2" className="font-normal cursor-pointer">Hembra</Label>
                            </div>
                        </RadioGroup>
                        {errors.genero && <div className="text-red-500 text-sm">{errors.genero}</div>}
                    </div>
                    <Button type="submit">Guardar Mascota</Button>
                </form>
            </div>
        </AppLayout>
    );
}