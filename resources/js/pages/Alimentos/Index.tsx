import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Megaphone, Utensils, Trash2, Edit3 } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Alimentos', href: '/alimentos' },
];

interface Alimento {
    id: number;
    mascota_id: number;
    nombre: string;
    marca: string;
    cantidad_diaria: string;
    notas?: string;
    mascota?: { nombre: string };
}

interface PaginatedData<T> {
    data: T[];
    links: { url: string | null; label: string; active: boolean; }[];
    current_page: number;
    prev_page_url: string | null;
    next_page_url: string | null;
    total: number;
    from: number;
    to: number;
}

interface PageProps {
    flash: { message?: string; };
    alimentos: PaginatedData<Alimento>;
}

export default function Index() {
    const { alimentos, flash } = usePage().props as unknown as PageProps;
    const { processing, delete: destroy } = useForm({});

    const handleDelete = (id: number) => {
        if (confirm(`¿Estás seguro de eliminar este registro de alimento?`)) {
            destroy(`/alimentacion/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Alimentación" />

            <div className='m-4 flex justify-between items-center'>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Utensils className="w-5 h-5 text-orange-500" /> Plan de Alimentación
                </h2>
                <Link href="/alimentacion/create">
                    <Button className='bg-orange-500 hover:bg-orange-600 font-semibold'>
                    Nuevo Alimento
                    </Button>
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

            {alimentos.data.length > 0 ? (
                <div className='m-4 border rounded-lg overflow-hidden bg-white dark:bg-zinc-950'>
                    <Table>
                        <TableHeader className="bg-slate-50 dark:bg-zinc-900">
                            <TableRow>
                                <TableHead className="w-[80px]">ID</TableHead>
                                <TableHead>Mascota</TableHead>
                                <TableHead>Alimento / Marca</TableHead>
                                <TableHead>Porción Diaria</TableHead>
                                <TableHead className='text-center'>Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {alimentos.data.map((ali) => (
                                <TableRow key={ali.id}>
                                    <TableCell className="font-mono text-muted-foreground text-xs">#{ali.id}</TableCell>
                                    <TableCell className="font-medium text-orange-500 dark:orange-blue-300">
                                        {ali.mascota?.nombre || 'N/A'}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-semibold">{ali.nombre}</span>
                                            <span className="text-xs text-muted-foreground uppercase">{ali.marca}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 px-2 py-1 rounded text-xs font-bold">
                                            {ali.cantidad_diaria}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-center space-x-2">
                                        <Link href={`/alimentacion/${ali.id}/edit`}>
                                            <Button size="sm" variant="outline" className='border-blue-600 text-blue-600 hover:bg-blue-50'>
                                                <Edit3 className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className='border-red-600 text-red-600 hover:bg-red-100'
                                            disabled={processing}
                                            onClick={() => handleDelete(ali.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {/* PAGINACIÓN */}
                    <div className="p-4 border-t flex flex-col items-center gap-4 bg-slate-50 dark:bg-transparent">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious 
                                        href={alimentos.prev_page_url || '#'} 
                                        className={!alimentos.prev_page_url ? 'pointer-events-none opacity-50' : ''}
                                    />
                                </PaginationItem>

                                {alimentos.links.map((link, idx) => {
                                    if (idx === 0 || idx === alimentos.links.length - 1) return null;
                                    const cleanLabel = link.label.replace('&laquo;', '').replace('&raquo;', '').trim();
                                    return (
                                        <PaginationItem key={idx}>
                                            <PaginationLink href={link.url || '#'} isActive={link.active}>
                                                {cleanLabel}
                                            </PaginationLink>
                                        </PaginationItem>
                                    );
                                })}

                                <PaginationItem>
                                    <PaginationNext 
                                        href={alimentos.next_page_url || '#'} 
                                        className={!alimentos.next_page_url ? 'pointer-events-none opacity-50' : ''}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                        <p className="text-xs text-muted-foreground">
                            Mostrando {alimentos.from} - {alimentos.to} de {alimentos.total} registros
                        </p>
                    </div>
                </div>
            ) : (
                <div className="p-20 text-center border-2 border-dashed m-4 rounded-xl text-muted-foreground">
                    <Utensils className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>No hay registros de alimentación cargados.</p>
                </div>
            )}
        </AppLayout>
    );
}