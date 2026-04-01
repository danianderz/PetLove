import { Head, Link, usePage } from '@inertiajs/react';

import { login, register } from '@/routes';
import mascotas from '@/routes/mascotas';
import { type SharedData } from '@/types';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Bienvenido a PetLove">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700"
                    rel="stylesheet"
                />
            </Head>

            <div className="flex min-h-screen flex-col bg-[#FDFDFC] text-[#1b1b18] dark:bg-[#0a0a0a] dark:text-[#EDEDEC]">
                {/* Header / Nav */}
                <header className="z-10 flex w-full items-center justify-between p-6 lg:px-12">
                    <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white shadow-lg">
                            <span className="text-xl font-bold">P</span>
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-orange-600 dark:text-orange-500">
                            PetLove
                        </span>
                    </div>

                    <nav className="flex items-center gap-4 text-sm font-medium">
                        {auth.user ? (
                            <Link
                                href={mascotas.index()}
                                className="rounded-full bg-orange-500 px-6 py-2 text-white transition hover:bg-orange-600 shadow-md"
                            >
                                Mis Mascotas
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="px-4 py-2 hover:text-orange-500 transition"
                                >
                                    Iniciar Sesión
                                </Link>
                                {canRegister && (
                                    <Link
                                        href={register()}
                                        className="rounded-full border border-orange-500 px-6 py-2 text-orange-500 transition hover:bg-orange-500 hover:text-white"
                                    >
                                        Registrarse
                                    </Link>
                                )}
                            </>
                        )}
                    </nav>
                </header>

                {/* Hero Section */}
                <main className="flex grow flex-col items-center justify-center px-6 lg:flex-row lg:px-12 lg:gap-12">
                    <div className="max-w-2xl space-y-8 text-center lg:text-left">
                        <h1 className="text-5xl font-extrabold leading-tight lg:text-7xl">
                            El lugar donde <br />
                            <span className="text-orange-500">tus mascotas</span> son familia.
                        </h1>
                        <p className="text-lg text-[#70706b] dark:text-[#9e9e9a] lg:text-xl">
                            Administra perfiles, controla su peso y guarda los mejores recuerdos de tus compañeros peludos en una plataforma pensada para ellos.
                        </p>
                        
                        <div className="flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
                            <Link
                                href={auth.user ? mascotas.index() : register()}
                                className="w-full rounded-2xl bg-[#1b1b18] px-8 py-4 text-center font-bold text-white transition hover:bg-[#3e3e3a] dark:bg-[#EDEDEC] dark:text-[#1b1b18] dark:hover:bg-[#d1d1d0] sm:w-auto shadow-xl"
                            >
                                {auth.user ? 'Ver mis mascotas' : 'Empezar ahora gratis'}
                            </Link>
                            <button className="w-full rounded-2xl border border-[#e3e3e0] px-8 py-4 text-center font-bold transition hover:bg-[#f5f5f4] dark:border-[#3e3e3a] dark:hover:bg-[#1b1b18] sm:w-auto">
                                Conocer más
                            </button>
                        </div>
                    </div>

                    {/* Imagen decorativa */}
                    <div className="relative mt-12 w-full max-w-[500px] lg:mt-0">
                        <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-orange-200/50 blur-3xl dark:bg-orange-900/20"></div>
                        <img 
                            src="https://www.elespectador.com/resizer/v2/V5RZA43Z7FEQVM6ASB46MPVXTI.jpg?auth=2718a4647f0e04ae50300e5b8afb8cf9b328d626d375748d4755ec50f4e18002&width=910&height=606&smart=true&quality=70" 
                            alt="Perros felices"
                            className="relative z-10 rounded-[2.5rem] shadow-2xl grayscale-[0.2] hover:grayscale-0 transition duration-500"
                        />
                        <div className="absolute -bottom-6 -left-6 z-20 rounded-2xl bg-white p-4 shadow-xl dark:bg-[#1b1b18]">
                            <div className="flex items-center gap-3">
                                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                                <p className="text-sm font-bold">¡+500 mascotas registradas!</p>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="p-8 text-center text-sm text-[#70706b] dark:text-[#9e9e9a]">
                    © {new Date().getFullYear()} PetLove — Hecho con ❤️ para los animales.
                </footer>
            </div>
        </>
    );
}