import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { create, edit } from '@/routes/mascotas'; // Asegúrate que estas rutas funcionen con tu config
import { Megaphone } from 'lucide-react';
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

// Importa los componentes de paginación de Shadcn
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

// Nueva interfaz para la estructura paginada de Laravel
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
    mascotas: PaginatedData<Mascota>; // Cambiado de Mascota[] a PaginatedData
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
                <Link href={create()}><Button>Añadir Mascota</Button></Link>
            </div>

            <div className="px-4">
                {flash.message && (
                    <Alert className="mb-4">
                        <Megaphone className="h-4 w-4" />
                        <AlertTitle>¡Notificación!</AlertTitle>
                        <AlertDescription>{flash.message}</AlertDescription>
                    </Alert>
                )}
            </div>

            {mascotas.data.length > 0 ? (
                <div className='m-4 border rounded-lg overflow-hidden'>
                    <Table>
                        
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px]">ID</TableHead>
                                <TableHead>Foto</TableHead>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Raza</TableHead>
                                <TableHead>Género</TableHead>
                                <TableHead className="text-right">Peso (kg)</TableHead>
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
                                    <TableCell className="font-medium">{mascota.nombre}</TableCell>
                                    <TableCell>{mascota.raza}</TableCell>
                                    <TableCell>{mascota.genero}</TableCell>
                                    <TableCell className="text-right">{mascota.peso || '--'}</TableCell>
                                    <TableCell className="text-center space-x-2">
                                        <Link href={edit(mascota.id)}>
                                            <Button size="sm" className='bg-sky-600  hover:bg-sky-700 '>Editar</Button>
                                        </Link>
                                        <Button
                                            size="sm"
                                            disabled={processing}
                                            onClick={() => handleDelete(mascota.id)}
                                            className='bg-red-500 hover:bg-red-700'
                                        >
                                            Eliminar
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
                                    
                                    // 1. Ignoramos los botones de los extremos (Prev/Next) ya que los pusimos manual arriba/abajo
                                    if (link.label.includes('Previous') || link.label.includes('Next') || idx === 0 || idx === mascotas.links.length - 1) {
                                        return null;
                                    }

                                    // 2. Limpiamos cualquier rastro de HTML que envíe Laravel por error
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
                <div className="p-8 text-center text-muted-foreground">
                    No tienes mascotas registradas todavía.
                </div>
            )}
        </AppLayout>
    );
}