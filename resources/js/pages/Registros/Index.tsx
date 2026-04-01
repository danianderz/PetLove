import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Megaphone, Stethoscope, CheckCircle2, Circle, Edit3, Trash2 } from 'lucide-react';

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
    { title: 'Registros Médicos', href: '/registros' },
];

interface RegistroMedico {
    id: number;
    mascota_id: number;
    tipo: string;
    titulo: string;
    descripcion: string;
    fecha_cita: string;
    completado: boolean;
    mascota?: { nombre: string }; // Para mostrar el nombre de la mascota
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
    registros: PaginatedData<RegistroMedico>;
}

export default function Index() {
    const { registros, flash } = usePage().props as unknown as PageProps;
    const { processing, delete: destroy } = useForm({});

    const handleDelete = (id: number) => {
        if (confirm(`¿Estás seguro de eliminar este registro médico?`)) {
            destroy(`/registros/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Registros Médicos" />

            <div className='m-4 flex justify-between items-center'>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Stethoscope className="w-5 h-5 text-blue-600" /> Historial Médico
                </h2>
                <Link href="/registros/create">
                    <Button className='bg-blue-600 hover:bg-blue-700 font-semibold '>Nuevo Registro</Button>
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

            {registros.data.length > 0 ? (
                <div className='m-4 border rounded-lg overflow-hidden bg-white dark:bg-zinc-950'>
                    <Table>
                        <TableHeader className="bg-slate-50 dark:bg-zinc-900">
                            <TableRow>
                                <TableHead className="w-[80px]">ID</TableHead>
                                <TableHead>Mascota</TableHead>
                                <TableHead>Título / Tipo</TableHead>
                                <TableHead>Fecha Cita</TableHead>
                                <TableHead className="text-center">Estado</TableHead>
                                <TableHead className='text-center'>Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {registros.data.map((reg) => (
                                <TableRow key={reg.id}>
                                    <TableCell className="font-mono text-muted-foreground text-xs">#{reg.id}</TableCell>
                                    <TableCell className="font-medium text-blue-600 dark:text-blue-400" >
                                        {reg.mascota?.nombre || 'N/A'}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-semibold">{reg.titulo}</span>
                                            <span className="text-xs text-muted-foreground uppercase">{reg.tipo}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{new Date(reg.fecha_cita).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-center">
                                        {reg.completado ? (
                                            <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" />
                                        ) : (
                                            <Circle className="w-5 h-5 text-amber-500 mx-auto" />
                                        )}
                                    </TableCell>
                                    <TableCell className="text-center space-x-2">
                                        <Link href={`/registros/${reg.id}/edit`}>
                                            <Button size="sm" variant="outline" className='border-blue-600 text-blue-600 hover:bg-blue-100'>
                                                <Edit3 className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                        <Button
                                            size="sm"
                                            variant="outline" className='border-red-600 text-red-600 hover:bg-red-100'
                                            disabled={processing}
                                            onClick={() => handleDelete(reg.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {/* PAGINACIÓN CORREGIDA */}
                    <div className="p-4 border-t flex flex-col items-center gap-4 bg-slate-50 dark:bg-transparent">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious 
                                        href={registros.prev_page_url || '#'} 
                                        className={!registros.prev_page_url ? 'pointer-events-none opacity-50' : ''}
                                    />
                                </PaginationItem>

                                {registros.links.map((link, idx) => {
                                    if (idx === 0 || idx === registros.links.length - 1) return null;
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
                                        href={registros.next_page_url || '#'} 
                                        className={!registros.next_page_url ? 'pointer-events-none opacity-50' : ''}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                        <p className="text-xs text-muted-foreground">
                            Mostrando {registros.from} - {registros.to} de {registros.total} registros
                        </p>
                    </div>
                </div>
            ) : (
                <div className="p-20 text-center border-2 border-dashed m-4 rounded-xl text-muted-foreground">
                    <Stethoscope className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>No hay registros médicos cargados.</p>
                </div>
            )}
        </AppLayout>
    );
}