import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Megaphone, Wallet, Trash2, Edit3, CircleDollarSign } from 'lucide-react';

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
    { title: 'Gastos', href: '/gastos' },
];

interface Gasto {
    id: number;
    mascota_id: number;
    categoria: string;
    monto: number;
    descripcion: string;
    fecha: string;
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
    gastos: PaginatedData<Gasto>;
}

export default function Index() {
    const { gastos, flash } = usePage().props as unknown as PageProps;
    const { processing, delete: destroy } = useForm({});

    const handleDelete = (id: number) => {
        if (confirm(`¿Estás seguro de eliminar este registro de gasto?`)) {
            destroy(`/gastos/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Control de Gastos" />

            <div className='m-4 flex justify-between items-center'>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-emerald-500" /> Control de Gastos
                </h2>
                <Link href="/gastos/create">
                    <Button className='bg-emerald-600 hover:bg-emerald-700 font-semibold'>
                       Nuevo Gasto
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

            {gastos.data.length > 0 ? (
                <div className='m-4 border rounded-lg overflow-hidden bg-white dark:bg-zinc-950'>
                    <Table>
                        <TableHeader className="bg-slate-50 dark:bg-zinc-900">
                            <TableRow>
                                <TableHead className="w-[80px]">ID</TableHead>
                                <TableHead>Mascota</TableHead>
                                <TableHead>Categoría / Descripción</TableHead>
                                <TableHead>Fecha</TableHead>
                                <TableHead className='text-right'>Monto</TableHead>
                                <TableHead className='text-center'>Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {gastos.data.map((gasto) => (
                                <TableRow key={gasto.id}>
                                    <TableCell className="font-mono text-muted-foreground text-xs">#{gasto.id}</TableCell>
                                    <TableCell className="font-medium text-emerald-600 dark:text-emerald-400">
                                        {gasto.mascota?.nombre || 'General'}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-semibold">{gasto.categoria}</span>
                                            <span className="text-xs text-muted-foreground line-clamp-1">{gasto.descripcion}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm">
                                        {new Date(gasto.fecha).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right font-bold text-slate-900 dark:text-white">
                                        ${Number(gasto.monto).toFixed(2)}
                                    </TableCell>
                                    <TableCell className="text-center space-x-2">
                                        <Link href={`/gastos/${gasto.id}/edit`}>
                                            <Button size="sm" variant="outline" className='border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30'>
                                                <Edit3 className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className='border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30'
                                            disabled={processing}
                                            onClick={() => handleDelete(gasto.id)}
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
                                        href={gastos.prev_page_url || '#'} 
                                        className={!gastos.prev_page_url ? 'pointer-events-none opacity-50' : ''}
                                    />
                                </PaginationItem>

                                {gastos.links.map((link, idx) => {
                                    if (idx === 0 || idx === gastos.links.length - 1) return null;
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
                                        href={gastos.next_page_url || '#'} 
                                        className={!gastos.next_page_url ? 'pointer-events-none opacity-50' : ''}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                        <p className="text-xs text-muted-foreground">
                            Mostrando {gastos.from} - {gastos.to} de {gastos.total} gastos registrados
                        </p>
                    </div>
                </div>
            ) : (
                <div className="p-20 text-center border-2 border-dashed m-4 rounded-xl text-muted-foreground">
                    <CircleDollarSign className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>No hay gastos registrados todavía.</p>
                </div>
            )}
        </AppLayout>
    );
}