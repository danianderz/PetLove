import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { create, edit } from '@/routes/mascotas'; 
import { Megaphone, Cat, Edit3, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";


import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Mascotas', href: '/mascotas' },
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


interface PaginatedData<T> {
    data: T[];
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    current_page: number;
    last_page: number;
    prev_page_url: string | null;
    next_page_url: string | null;
    total: number;
    from: number;
    to: number;
}

interface PageProps {
    flash: { message?: string; };
    mascotas: PaginatedData<Mascota>; 
}

export default function Index() {
    const { mascotas, flash } = usePage().props as unknown as PageProps;
    const { processing, delete: destroy } = useForm({});

    const handleDelete = (id: number) => {
        const mascota = mascotas.data.find(m => m.id === id);
        if (confirm(`¿Estás seguro de que deseas eliminar a ${mascota?.nombre}?`)) {
            destroy(`/mascotas/${id}`, {
                onSuccess: () => console.log('Mascota eliminada'),
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mascotas" />

            <div className='m-4 flex justify-between items-center'>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Cat className="w-5 h-5 text-yellow-500" /> Tus Mascotas
                </h2>
                <Link href="/mascotas/create">
                    <Button className='bg-yellow-500 hover:bg-yellow-600 font-semibold '>Añadir Mascota</Button>
                </Link>
            </div>

            <div className="px-4">
                {flash.message && (
                    <Alert className="mb-4 border-green-500 text-green-600 dark:text-green-400 bg-green-50/50 dark:bg-green-950/20">
                        <Megaphone className="h-4 w-4" />
                        <AlertTitle>¡Éxito!</AlertTitle>
                        <AlertDescription>{flash.message}</AlertDescription>
                    </Alert>
                )}
            </div>

            {mascotas.data.length > 0 ? (
                <div className='m-4 border rounded-lg overflow-hidden bg-white dark:bg-zinc-950'>
                    <Table>       
                        <TableHeader className="bg-slate-50 dark:bg-zinc-900">
                            <TableRow>
                                <TableHead className="w-[80px]">ID</TableHead>
                                <TableHead >Foto</TableHead>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Raza</TableHead>
                                <TableHead>Género</TableHead>
                                <TableHead className='text-center'>Peso</TableHead>
                                <TableHead className='text-center'>Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mascotas.data.map((mascota) => (
                                <TableRow key={mascota.id}>
                                    <TableCell className="font-mono text-muted-foreground">#{mascota.id}</TableCell>
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
                                    <TableCell className="font-medium text-yellow-600 dark:text-yellow-400">{mascota.nombre}</TableCell>
                                    <TableCell>{mascota.raza}</TableCell>
                                    <TableCell>{mascota.genero}</TableCell>
                                    <TableCell className='text-center'>{mascota.peso || '--'} kg</TableCell>
                                    <TableCell className="text-center space-x-2">
                                        <Link href={edit(mascota.id)}>
                                            <Button size="sm" variant="outline" className='border-blue-600 text-blue-600 hover:bg-blue-100'>
                                                <Edit3 className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                        <Button
                                            size="sm"
                                            variant="outline" className='border-red-600 text-red-600 hover:bg-red-100'
                                            disabled={processing}
                                            onClick={() => handleDelete(mascota.id)}                                        
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {/* SECCIÓN DE PAGINACIÓN */}
                    <div className="p-4 border-t  flex flex-col items-center gap-4">
                        <Pagination>
                            <PaginationContent className="flex-wrap justify-center">
                                <PaginationItem>
                                    <PaginationPrevious
                                        href={mascotas.prev_page_url || '#'}
                                        className={!mascotas.prev_page_url ? 'pointer-events-none opacity-50' : ''}
                                    />
                                </PaginationItem>

                                {mascotas.links.map((link, idx) => {
                                        
                                    if (link.label.includes('Previous') || link.label.includes('Next') || idx === 0 || idx === mascotas.links.length - 1) {
                                        return null;
                                    }
                                   
                                    const cleanLabel = link.label.replace('&laquo;', '').replace('&raquo;', '').trim();

                                    return (
                                        <PaginationItem key={idx}>
                                            <PaginationLink
                                                href={link.url || '#'}
                                                isActive={link.active}
                                            >
                                                {cleanLabel}
                                            </PaginationLink>
                                        </PaginationItem>
                                    );
                                })}

                                <PaginationItem>
                                    <PaginationNext
                                        href={mascotas.next_page_url || '#'}
                                        className={!mascotas.next_page_url ? 'pointer-events-none opacity-50' : ''}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                        <p className="text-center text-xs text-muted-foreground mt-2">
                            Mostrando {mascotas.from} - {mascotas.to} de {mascotas.total} mascotas
                        </p>
                    </div>
                </div>
            ) : (               
                <div className="p-20 text-center border-2 border-dashed m-4 rounded-xl text-muted-foreground">
                    <Cat className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>No tienes mascotas registradas todavía.</p>
                </div>
            )}
        </AppLayout>
    );
}