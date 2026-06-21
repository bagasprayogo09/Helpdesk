import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    Building,
    FolderGit2,
    LayoutGrid,
    Tag,
    Ticket,
    History,
} from 'lucide-react';
import AppLogo from '@/components/app/app-logo';
import { NavFooter } from '@/components/nav/nav-footer';
import { NavMain } from '@/components/nav/nav-main';
import { NavUser } from '@/components/nav/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { index as ticketsIndex } from '@/routes/tickets';
import { index as divisisIndex } from '@/routes/divisis';
import { index as issueCategoriesIndex } from '@/routes/issue-categories';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Tickets',
        href: ticketsIndex(),
        icon: Ticket,
    },
    {
        title: 'Divisi',
        href: divisisIndex(),
        icon: Building,
    },
    {
        title: 'Kategori Masalah',
        href: issueCategoriesIndex(),
        icon: Tag,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { auth } = usePage().props as any;
    const role = auth?.user?.role;
    const isAdminOrSupervisor = role === 'admin' || role === 'supervisor';

    const menuItems = [...mainNavItems];
    if (isAdminOrSupervisor) {
        menuItems.push({
            title: 'Log Audit',
            href: '/audit-logs',
            icon: History,
        });
    }

    return (
        <Sidebar collapsible="offcanvas" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={menuItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
