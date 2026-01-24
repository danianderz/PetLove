import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
    Plus,
    MoreVertical,
    Trash2,
    Image as ImageIcon,
    Calendar,
    Heart,
    Download,
    Pencil
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Mascota {
    id: number;
    nombre: string;
}

interface Momento {
    id: number;
    mascota_id: number;
    ruta_foto: string;
    anecdota: string;
    fecha_creacion: string;
    mascota: Mascota;
}

interface Props {
    momentos: {
        data: Momento[];
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Momentos', href: '/momentos' },
];

export default function Index({ momentos }: Props) {

    const handleDelete = (id: number) => {
        if (confirm('¿Estás seguro de que deseas eliminar este recuerdo?')) {
            router.delete(`/momentos/${id}`);
        }
    };
    const handleEdit = (id: number) => {
        router.get(`/momentos/${id}/edit`);
    };

    const handleDownload = (id: number) => {
        window.location.href = `/momentos/${id}/download`;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Momentos" />

            <div className="p-6">
                {/* Encabezado */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <ImageIcon className="w-6 h-6 text-indigo-500" />
                            Galería de Momentos
                        </h2>
                        <p className="text-muted-foreground text-sm">Los mejores recuerdos con tus compañeros.</p>
                    </div>
                    <Link href="/momentos/create">
                        <Button className="bg-indigo-600 hover:bg-indigo-700 font-semibold">
                            Nuevo Momento
                        </Button>
                    </Link>
                </div>

                {momentos.data.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {momentos.data.map((momento) => (
                            <Card key={momento.id} className="group overflow-hidden border-none bg-secondary/30 hover:shadow-xl transition-all duration-300 pt-0 pb-4">
                                {/* Contenedor de Imagen */}
                                <div className="relative aspect-square overflow-hidden bg-muted rounded-t-none">
                                    <img
                                        src={`/storage/${momento.ruta_foto}`}
                                        alt="Momento"
                                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="secondary" size="icon" className="h-8 w-8 shadow-md">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    onClick={() => handleDelete(momento.id)}
                                                    className="text-red-600 focus:text-red-600"
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" /> Eliminar
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleEdit(momento.id)}>
                                                    <Pencil className="w-4 h-4 mr-2" /> Editar
                                                </DropdownMenuItem>

                                                <DropdownMenuItem onClick={() => handleDownload(momento.id)}>
                                                    <Download className="w-4 h-4 mr-2" /> Descargar
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                    <div className="absolute bottom-2 left-2">
                                        <span className="bg-black/50 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1">
                                            <Heart className="w-3 h-3 text-red-400 fill-red-400" /> {momento.mascota.nombre}
                                        </span>
                                    </div>
                                </div>

                                {/* Contenido/Info */}
                                <CardContent className="px-4">
                                    <p className="text-sm line-clamp-2 text-foreground/80 italic pt-0">
                                        "{momento.anecdota}"
                                    </p>
                                </CardContent>

                                <CardFooter className="px-4 pb-0 pt-0 flex justify-between items-center text-muted-foreground">
                                    <div className="flex items-center gap-1 text-[11px]">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(momento.fecha_creacion).toLocaleDateString()}
                                    </div>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                ) : (
                    /* Estado Vacío */
                    <div className="flex flex-col items-center justify-center py-20 bg-secondary/10 rounded-xl border-2 border-dashed">
                        <ImageIcon className="w-12 h-12 text-muted-foreground mb-4 opacity-20" />
                        <p className="text-muted-foreground">Aún no has subido ningún momento.</p>
                        <Link href="/momentos/create" className="mt-4">
                            <Button variant="outline">Comenzar álbum</Button>
                        </Link>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}