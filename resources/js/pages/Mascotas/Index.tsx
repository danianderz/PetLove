import { Head, Link, useForm, usePage } from '@inertiajs/react';

import AppLayout from '@/layouts/app-layout';

import { type BreadcrumbItem } from '@/types';
import mascotas, { create, edit } from '@/routes/mascotas';

import { InfoIcon, Megaphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { use } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Interface } from 'readline';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { route } from 'ziggy-js';



const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Mascotas',
        href: '/mascotas',
    },
];

interface Mascota {
    id: number;
    nombre: string;
    raza: string;
    foto: string | null;
    fecha_nacimiento: string;
    peso: string;
    genero: string;
    usuario_id: number;
}
interface PageProps {
    flash: {
        message?: string;
    }
    mascotas: Mascota[];
}

export default function Index() {
    const { mascotas, flash } = usePage().props as PageProps;

    const {processing, delete: destroy} = useForm({});

    const handleDelete = (id: number) => {
        if (confirm(`¿Estás seguro de que deseas eliminar la mascota - ${id} - ${mascotas.find(m => m.id === id)?.nombre}?`)) {
            destroy(mascotas.find(m => m.id === id) ? `/mascotas/${id}` : '', {
                onSuccess: () => console.log('Mascota eliminada'),
            });
            console.log(`Eliminar mascota con ID: ${id}`);
            // Aquí puedes hacer una llamada a la API o Inertia para eliminar la mascota
        }
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mascotas" />
            <div className='m-4'>
                <Link href={create()}><Button>Añadir Mascota</Button></Link>
            </div>
            <div className="p-4">
                <div>
                    {flash.message && (
                        <Alert>
                            <Megaphone />
                            <AlertTitle>Notificación!</AlertTitle>
                            <AlertDescription>
                                {flash.message}
                            </AlertDescription>
                        </Alert>
                    )}
                </div>
            </div>
            {mascotas.length > 0 && (
                <div className='m-4 border rounded-lg'>
                    <Table>
                        <TableCaption>Lista de tus mascotas registradas.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                {/* Nueva columna para el ID */}
                                <TableHead className="w-[100px]">ID</TableHead>
                                <TableHead>Foto</TableHead>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Raza</TableHead>
                                <TableHead>Género</TableHead>
                                <TableHead className="text-right">Peso (kg)</TableHead>
                                <TableHead className='text-center'>Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mascotas.map((mascota) => (
                                <TableRow key={mascota.id}>
                                    {/* Celda con el ID de la mascota */}
                                    <TableCell className="font-mono text-muted-foreground">
                                        #{mascota.id}
                                    </TableCell>

                                    <TableCell>
                                        {mascota.foto ? (
                                            <img
                                                src={`/storage/${mascota.foto}`}
                                                alt={mascota.nombre}
                                                className="w-10 h-10 rounded-full object-cover border"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-[10px] text-muted-foreground border">
                                                SIN FOTO
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell className="font-medium">{mascota.nombre}</TableCell>
                                    <TableCell>{mascota.raza}</TableCell>
                                    <TableCell>{mascota.genero}</TableCell>
                                    <TableCell className="text-right">
                                        {mascota.peso ? `${mascota.peso}` : '--'}
                                    </TableCell>
                                    <TableCell className="text-center space-x-2">
                                        <Link href={edit(mascota.id)}>
                                            <Button className='bg-slate-600 hover:bg-slate-700' variant="outline">Edit</Button>
                                        </Link>
                                        <Button disabled={processing} onClick={() => handleDelete(mascota.id)} className='bg-red-500 hover:bg-red-700'>Delete</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </AppLayout>
    );
}
    
