import { Link } from '@inertiajs/react';
import { Dog, Syringe, HandCoins, Image, UtensilsCrossed} from 'lucide-react';

import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import mascotas from '@/routes/mascotas';
import { type NavItem } from '@/types';

import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Mascotas',
        href: '/mascotas',
        icon: Dog,
    },
    {
        title: 'Registros médicos',
        href: '/registros',
        icon: Syringe,
    },
    {
        title: 'Alimentacion',
        href: '/alimentacion',
        icon: UtensilsCrossed,
    },
    {
        title: 'Gastos',
        href: '/gastos',
        icon: HandCoins,
    },
    {
        title: 'Momentos',
        href: '/momentos',
        icon: Image,
    },

];

const footerNavItems: NavItem[] = [
    
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={mascotas.index()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
