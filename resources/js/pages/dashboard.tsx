import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard } from '@/routes';
import Heading from '@/components/app/heading';
import {
    Ticket,
    Inbox,
    AlertCircle,
    Clock,
    CheckCircle2,
    ArrowRight,
    Eye,
    Building2,
    User,
    TrendingUp,
    BarChart3,
    Zap,
    Plus,
} from 'lucide-react';
import * as ticketRoutes from '@/routes/api/tickets';
import * as divisiRoutes from '@/routes/api/divisi';
import * as issueCategoryRoutes from '@/routes/api/issue-categories';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TicketCalendar, CalendarEvent } from '@/components/tickets/calendar';
import React from 'react';

interface TicketStats {
    total: number;
    unassigned: number;
    by_status: {
        value: string;
        label: string;
        color: string;
        count: number;
    }[];
    by_priority: {
        value: string;
        label: string;
        color: string;
        count: number;
    }[];
    recent_tickets: {
        id: number;
        ticket_number: string;
        subject: string;
        user_name: string;
        divisi_name: string;
        status_label: string;
        status_color: string;
        created_at: string;
    }[];
    calendar_events: CalendarEvent[];
}

interface Props {
    stats: TicketStats;
}

export default function Dashboard({ stats }: Props) {
    const byStatus = stats?.by_status || [];
    const byPriority = stats?.by_priority || [];
    const recentTickets = stats?.recent_tickets || [];
    const totalCount = stats?.total || 0;
    const unassignedCount = stats?.unassigned || 0;
    const calendarEvents = stats?.calendar_events || [];

    const { auth } = usePage().props as any;
    const role = auth?.user?.role;
    const isAdminOrSupervisor = role === 'admin' || role === 'supervisor';

    // Derived counts
    const inProgressCount =
        byStatus.find((s) => s.value === 'in_progress')?.count || 0;
    const resolvedCount =
        byStatus.find((s) => s.value === 'resolved')?.count || 0;

    // Helpers to scale chart heights
    const maxPriorityCount = Math.max(...byPriority.map((p) => p.count), 1);

    const getStatusColorClasses = (statusValue: string) => {
        switch (statusValue) {
            case 'open':
                return {
                    dot: 'bg-blue-500',
                    bar: 'bg-gradient-to-r from-blue-500 to-indigo-500',
                    badge: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 ring-1 ring-blue-100 dark:ring-blue-950/30',
                };
            case 'pending':
                return {
                    dot: 'bg-yellow-500',
                    bar: 'bg-gradient-to-r from-yellow-500 to-amber-500',
                    badge: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400 ring-1 ring-yellow-100 dark:ring-yellow-950/30',
                };
            case 'in_progress':
                return {
                    dot: 'bg-orange-500',
                    bar: 'bg-gradient-to-r from-orange-500 to-amber-600',
                    badge: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400 ring-1 ring-orange-100 dark:ring-orange-950/30',
                };
            case 'resolved':
                return {
                    dot: 'bg-green-500',
                    bar: 'bg-gradient-to-r from-green-500 to-emerald-500',
                    badge: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 ring-1 ring-green-100 dark:ring-green-950/30',
                };
            case 'closed':
                return {
                    dot: 'bg-gray-500',
                    bar: 'bg-gradient-to-r from-gray-500 to-slate-500',
                    badge: 'bg-gray-50 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400 ring-1 ring-gray-100 dark:ring-gray-800',
                };
            default:
                return {
                    dot: 'bg-indigo-500',
                    bar: 'bg-indigo-500',
                    badge: 'bg-indigo-50 text-indigo-600 border-indigo-100',
                };
        }
    };

    const getPriorityColorClasses = (priorityValue: string) => {
        switch (priorityValue) {
            case 'low':
                return {
                    bar: 'bg-gradient-to-t from-slate-400 to-slate-500',
                    badge: 'bg-slate-50 text-slate-600 dark:bg-slate-900/20 dark:text-slate-400 ring-1 ring-slate-100 dark:ring-slate-800',
                };
            case 'medium':
                return {
                    bar: 'bg-gradient-to-t from-blue-500 to-indigo-500',
                    badge: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 ring-1 ring-blue-100 dark:ring-blue-900/40',
                };
            case 'high':
                return {
                    bar: 'bg-gradient-to-t from-orange-400 to-amber-500',
                    badge: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400 ring-1 ring-orange-100 dark:ring-orange-900/40',
                };
            case 'urgent':
                return {
                    bar: 'bg-gradient-to-t from-red-500 to-rose-600 animate-pulse',
                    badge: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 ring-1 ring-red-100 dark:ring-red-900/40',
                };
            default:
                return {
                    bar: 'bg-indigo-500',
                    badge: 'bg-indigo-50 text-indigo-600',
                };
        }
    };

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-8 p-6 lg:p-12">
                <div className="flex items-center gap-3">
                    <span className="h-px w-8 bg-indigo-600"></span>
                    <span className="text-xs font-black tracking-widest text-indigo-600 uppercase">
                        Overview
                    </span>
                </div>

                <Heading
                    title="Dashboard"
                    description="Welcome to your support hub. Here's what's happening today."
                />

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Total Tickets */}
                    <div className="group relative overflow-hidden rounded-[2rem] border-none bg-white p-6 shadow-sm ring-1 ring-gray-100 transition-all duration-300 hover:scale-[1.02] hover:shadow-md dark:bg-white/5 dark:ring-white/10">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold tracking-widest text-gray-500 uppercase dark:text-gray-400">
                                Total Tiket
                            </span>
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 transition-transform duration-300 group-hover:rotate-12 dark:bg-indigo-900/20 dark:text-indigo-400">
                                <Ticket className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <h3 className="font-mono text-3xl font-black text-gray-900 dark:text-white">
                                {totalCount}
                            </h3>
                            <p className="mt-1 text-xs text-gray-400">
                                Seluruh laporan masuk
                            </p>
                        </div>
                    </div>

                    {/* Unassigned / Open */}
                    <div className="group relative overflow-hidden rounded-[2rem] border-none bg-white p-6 shadow-sm ring-1 ring-gray-100 transition-all duration-300 hover:scale-[1.02] hover:shadow-md dark:bg-white/5 dark:ring-white/10">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold tracking-widest text-gray-500 uppercase dark:text-gray-400">
                                Belum Ditugaskan
                            </span>
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 transition-transform duration-300 group-hover:rotate-12 dark:bg-amber-900/20 dark:text-amber-400">
                                <AlertCircle className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <h3 className="font-mono text-3xl font-black text-gray-900 dark:text-white">
                                {unassignedCount}
                            </h3>
                            <p className="mt-1 text-xs text-gray-400">
                                Butuh respon segera
                            </p>
                        </div>
                    </div>

                    {/* In Progress */}
                    <div className="group relative overflow-hidden rounded-[2rem] border-none bg-white p-6 shadow-sm ring-1 ring-gray-100 transition-all duration-300 hover:scale-[1.02] hover:shadow-md dark:bg-white/5 dark:ring-white/10">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold tracking-widest text-gray-500 uppercase dark:text-gray-400">
                                Sedang Dikerjakan
                            </span>
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 transition-transform duration-300 group-hover:rotate-12 dark:bg-orange-900/20 dark:text-orange-400">
                                <Clock className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <h3 className="font-mono text-3xl font-black text-gray-900 dark:text-white">
                                {inProgressCount}
                            </h3>
                            <p className="mt-1 text-xs text-gray-400">
                                Dalam proses penyelesaian
                            </p>
                        </div>
                    </div>

                    {/* Resolved */}
                    <div className="group relative overflow-hidden rounded-[2rem] border-none bg-white p-6 shadow-sm ring-1 ring-gray-100 transition-all duration-300 hover:scale-[1.02] hover:shadow-md dark:bg-white/5 dark:ring-white/10">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold tracking-widest text-gray-500 uppercase dark:text-gray-400">
                                Selesai
                            </span>
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-green-600 transition-transform duration-300 group-hover:rotate-12 dark:bg-green-900/20 dark:text-green-400">
                                <CheckCircle2 className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <h3 className="font-mono text-3xl font-black text-gray-900 dark:text-white">
                                {resolvedCount}
                            </h3>
                            <p className="mt-1 text-xs text-gray-400">
                                Tiket berhasil ditangani
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Column 1 & 2: Latest Tickets and Charts */}
                    <div className="flex flex-col gap-8 lg:col-span-2">
                        {/* Latest Tickets Table */}
                        <Card className="overflow-hidden rounded-[2.5rem] border-none bg-white shadow-sm ring-1 ring-gray-100 dark:bg-white/5 dark:ring-white/10">
                            <CardHeader className="flex flex-row items-center justify-between border-b border-gray-100 px-8 py-6 dark:border-white/5">
                                <div className="space-y-1.5">
                                    <CardTitle className="text-lg font-black tracking-tight text-gray-900 dark:text-white">
                                        Tiket Terbaru
                                    </CardTitle>
                                    <CardDescription className="text-xs font-medium text-gray-500">
                                        Laporan bantuan teknis yang baru saja
                                        diajukan.
                                    </CardDescription>
                                </div>
                                <Link href={ticketRoutes.index()}>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="gap-1.5 rounded-xl font-bold text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                                    >
                                        Lihat Semua
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </Link>
                            </CardHeader>
                            <CardContent className="p-0">
                                {/* Mobile View (Card List) */}
                                <div className="block divide-y divide-gray-100 sm:hidden dark:divide-white/5">
                                    {recentTickets.length === 0 ? (
                                        <div className="px-8 py-16 text-center font-bold text-muted-foreground">
                                            Belum ada tiket masuk.
                                        </div>
                                    ) : (
                                        recentTickets.map((ticket) => {
                                            const statusColors =
                                                getStatusColorClasses(
                                                    ticket.status_color,
                                                );
                                            return (
                                                <div
                                                    key={ticket.id}
                                                    className="flex flex-col gap-3 p-6"
                                                >
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="font-mono text-[10px] font-black text-indigo-600 dark:text-indigo-400">
                                                                {
                                                                    ticket.ticket_number
                                                                }
                                                            </span>
                                                            <span className="leading-tight font-bold text-gray-900 dark:text-white">
                                                                {ticket.subject}
                                                            </span>
                                                        </div>
                                                        <Badge
                                                            variant="outline"
                                                            className={`w-fit rounded-full px-2 py-0.5 text-[8px] font-black tracking-wider uppercase ${statusColors.badge}`}
                                                        >
                                                            {
                                                                ticket.status_label
                                                            }
                                                        </Badge>
                                                    </div>
                                                    <div className="flex items-center justify-between text-[10px] text-gray-500">
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="font-bold text-gray-700 dark:text-gray-300">
                                                                {
                                                                    ticket.user_name
                                                                }
                                                            </span>
                                                            <span className="font-mono">
                                                                {
                                                                    ticket.created_at
                                                                }
                                                            </span>
                                                        </div>
                                                        <span className="rounded bg-gray-50 px-2 py-0.5 font-bold text-gray-600 uppercase dark:bg-white/5 dark:text-gray-400">
                                                            {ticket.divisi_name}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-end pt-1">
                                                        <Link
                                                            href={ticketRoutes.show(
                                                                {
                                                                    ticket: ticket.id,
                                                                },
                                                            )}
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 gap-1 rounded-lg text-xs font-bold hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-900/20"
                                                            >
                                                                <Eye className="h-3.5 w-3.5" />
                                                                Lihat
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>

                                {/* Desktop View (Table) */}
                                <div className="hidden overflow-x-auto sm:block">
                                    <table className="w-full text-left text-sm">
                                        <thead>
                                            <tr className="border-b border-gray-50 bg-gray-50/30 dark:border-white/5 dark:bg-white/[0.01]">
                                                <th className="px-8 py-4 text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase">
                                                    Informasi Tiket
                                                </th>
                                                <th className="px-8 py-4 text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase">
                                                    Departemen & Pengaju
                                                </th>
                                                <th className="px-8 py-4 text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase">
                                                    Status & Waktu
                                                </th>
                                                <th className="px-8 py-4 text-right text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase">
                                                    Detail
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                                            {recentTickets.length === 0 ? (
                                                <tr>
                                                    <td
                                                        colSpan={4}
                                                        className="px-8 py-24 text-center font-bold text-muted-foreground"
                                                    >
                                                        Belum ada tiket masuk.
                                                    </td>
                                                </tr>
                                            ) : (
                                                recentTickets.map((ticket) => {
                                                    const statusColors =
                                                        getStatusColorClasses(
                                                            ticket.status_color,
                                                        );
                                                    return (
                                                        <tr
                                                            key={ticket.id}
                                                            className="group transition-colors duration-200 hover:bg-gray-50/50 dark:hover:bg-white/[0.02]"
                                                        >
                                                            <td className="px-8 py-5">
                                                                <div className="flex flex-col gap-1">
                                                                    <span className="font-mono text-xs font-black text-indigo-600 dark:text-indigo-400">
                                                                        {
                                                                            ticket.ticket_number
                                                                        }
                                                                    </span>
                                                                    <span className="leading-tight font-bold text-gray-900 dark:text-white">
                                                                        {
                                                                            ticket.subject
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </td>
                                                            <td className="px-8 py-5">
                                                                <div className="flex flex-col gap-1">
                                                                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700 dark:text-gray-300">
                                                                        <Building2 className="h-3.5 w-3.5 text-gray-400" />
                                                                        {
                                                                            ticket.divisi_name
                                                                        }
                                                                    </div>
                                                                    <div className="flex items-center gap-1.5 text-[10px] font-medium text-gray-400">
                                                                        <User className="h-3 w-3" />
                                                                        {
                                                                            ticket.user_name
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-8 py-5">
                                                                <div className="flex flex-col gap-1.5">
                                                                    <Badge
                                                                        variant="outline"
                                                                        className={`w-fit rounded-full px-2.5 py-0.5 text-[9px] font-black tracking-wider uppercase ${statusColors.badge}`}
                                                                    >
                                                                        {
                                                                            ticket.status_label
                                                                        }
                                                                    </Badge>
                                                                    <span className="font-mono text-[10px] font-medium text-gray-400">
                                                                        {
                                                                            ticket.created_at
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </td>
                                                            <td className="px-8 py-5 text-right">
                                                                <Link
                                                                    href={ticketRoutes.show(
                                                                        {
                                                                            ticket: ticket.id,
                                                                        },
                                                                    )}
                                                                >
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-9 w-9 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-900/20"
                                                                    >
                                                                        <Eye className="h-4 w-4" />
                                                                    </Button>
                                                                </Link>
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Charts Grid */}
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                            {/* Status Distribution Chart */}
                            <Card className="flex flex-col gap-6 rounded-[2.5rem] border-none bg-white p-8 shadow-sm ring-1 ring-gray-100 dark:bg-white/5 dark:ring-white/10">
                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-2">
                                        <TrendingUp className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                        <CardTitle className="text-base font-black tracking-tight text-gray-900 dark:text-white">
                                            Status Distribusi
                                        </CardTitle>
                                    </div>
                                    <CardDescription className="text-xs font-medium text-gray-500">
                                        Breakdown tiket berdasarkan status
                                        pengerjaan.
                                    </CardDescription>
                                </div>

                                <div className="flex flex-col gap-5">
                                    {byStatus.length === 0 ? (
                                        <div className="py-12 text-center text-xs text-muted-foreground">
                                            Tidak ada data status.
                                        </div>
                                    ) : (
                                        byStatus.map((status) => {
                                            const percentage =
                                                totalCount > 0
                                                    ? (status.count /
                                                          totalCount) *
                                                      100
                                                    : 0;
                                            const colorClasses =
                                                getStatusColorClasses(
                                                    status.value,
                                                );

                                            return (
                                                <div
                                                    key={status.value}
                                                    className="space-y-2"
                                                >
                                                    <div className="flex items-center justify-between text-xs">
                                                        <span className="flex items-center gap-2 font-bold text-gray-700 dark:text-gray-300">
                                                            <span
                                                                className={`h-2.5 w-2.5 rounded-full ${colorClasses.dot}`}
                                                            />
                                                            {status.label}
                                                        </span>
                                                        <span className="font-mono font-black text-gray-900 dark:text-white">
                                                            {status.count}{' '}
                                                            <span className="text-[10px] font-medium text-gray-400">
                                                                (
                                                                {Math.round(
                                                                    percentage,
                                                                )}
                                                                %)
                                                            </span>
                                                        </span>
                                                    </div>
                                                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-zinc-800">
                                                        <div
                                                            className={`h-full rounded-full transition-all duration-500 ease-out ${colorClasses.bar}`}
                                                            style={{
                                                                width: `${percentage}%`,
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </Card>

                            {/* Priority Visual Chart */}
                            <Card className="flex flex-col gap-6 rounded-[2.5rem] border-none bg-white p-8 shadow-sm ring-1 ring-gray-100 dark:bg-white/5 dark:ring-white/10">
                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-2">
                                        <BarChart3 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                        <CardTitle className="text-base font-black tracking-tight text-gray-900 dark:text-white">
                                            Prioritas Tiket
                                        </CardTitle>
                                    </div>
                                    <CardDescription className="text-xs font-medium text-gray-500">
                                        Tingkat keseriusan laporan yang masuk.
                                    </CardDescription>
                                </div>

                                {byPriority.length === 0 ? (
                                    <div className="py-12 text-center text-xs text-muted-foreground">
                                        Tidak ada data prioritas.
                                    </div>
                                ) : (
                                    <div className="relative flex h-48 items-end justify-between gap-4 px-2 pt-6">
                                        {byPriority.map((prio) => {
                                            const heightPercent =
                                                totalCount > 0
                                                    ? (prio.count /
                                                          maxPriorityCount) *
                                                          80 +
                                                      10
                                                    : 10; // Min 10% height for presence
                                            const colorClasses =
                                                getPriorityColorClasses(
                                                    prio.value,
                                                );
                                            return (
                                                <div
                                                    key={prio.value}
                                                    className="group relative flex h-full flex-1 flex-col items-center justify-end gap-3"
                                                >
                                                    {/* Tooltip on Hover */}
                                                    <div className="pointer-events-none absolute bottom-full z-10 mb-2 rounded-lg bg-zinc-900 px-2.5 py-1.5 font-mono text-[10px] font-bold whitespace-nowrap text-white opacity-0 shadow-xl transition-opacity duration-200 group-hover:opacity-100 dark:bg-white dark:text-zinc-900">
                                                        {prio.count} Tiket
                                                    </div>

                                                    {/* Bar container */}
                                                    <div className="relative flex h-full w-full items-end overflow-hidden rounded-2xl bg-zinc-50 dark:bg-zinc-800/40">
                                                        <div
                                                            className={`w-full rounded-t-xl shadow-inner transition-all duration-700 ease-out ${colorClasses.bar}`}
                                                            style={{
                                                                height: `${heightPercent}%`,
                                                            }}
                                                        />
                                                    </div>

                                                    {/* Label */}
                                                    <div className="w-full truncate text-center text-[10px] font-black tracking-widest text-zinc-400 uppercase dark:text-zinc-500">
                                                        {prio.label}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </Card>
                        </div>
                    </div>

                    {/* Column 3: Calendar & Quick Actions */}
                    <div className="flex flex-col gap-8 lg:col-span-1">
                        <TicketCalendar
                            events={calendarEvents}
                            compact={true}
                        />

                        {/* Quick Actions Card */}
                        <Card className="rounded-[2.5rem] border-none bg-white p-8 shadow-sm ring-1 ring-gray-100 dark:bg-white/5 dark:ring-white/10">
                            <div className="mb-6 space-y-1.5">
                                <div className="flex items-center gap-2">
                                    <Zap className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                    <CardTitle className="text-base font-black tracking-tight text-gray-900 dark:text-white">
                                        Aksi Cepat
                                    </CardTitle>
                                </div>
                                <CardDescription className="text-xs font-medium text-gray-500">
                                    Akses instan ke fungsi utama helpdesk.
                                </CardDescription>
                            </div>

                            <div className="flex flex-col gap-3">
                                <Link
                                   href="/tickets/create"
                                    className="w-full"
                                >
                                    <Button className="w-full justify-start gap-2.5 rounded-2xl bg-indigo-600 py-5 font-bold text-white shadow-lg shadow-indigo-100 transition-all duration-200 hover:bg-indigo-700 dark:shadow-none">
                                        <Plus className="h-4 w-4" />
                                        Buat Tiket Baru
                                    </Button>
                                </Link>

                                <Link
                                    href={ticketRoutes.index().url}
                                    className="w-full"
                                >
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start gap-2.5 rounded-2xl border-gray-200 py-5 font-bold text-gray-700 transition-all duration-200 hover:bg-gray-50 dark:border-zinc-800 dark:text-gray-300 dark:hover:bg-zinc-900/50"
                                    >
                                        <Ticket className="h-4 w-4 text-gray-400" />
                                        Daftar Tiket Anda
                                    </Button>
                                </Link>

                                {isAdminOrSupervisor && (
                                    <>
                                        <Link
                                            href={divisiRoutes.index().url}
                                            className="w-full"
                                        >
                                            <Button
                                                variant="outline"
                                                className="w-full justify-start gap-2.5 rounded-2xl border-gray-200 py-5 font-bold text-gray-700 transition-all duration-200 hover:bg-gray-50 dark:border-zinc-800 dark:text-gray-300 dark:hover:bg-zinc-900/50"
                                            >
                                                <Building2 className="h-4 w-4 text-gray-400" />
                                                Kelola Departemen
                                            </Button>
                                        </Link>

                                        <Link
                                            href={issueCategoryRoutes.index().url}
                                            className="w-full"
                                        >
                                            <Button
                                                variant="outline"
                                                className="w-full justify-start gap-2.5 rounded-2xl border-gray-200 py-5 font-bold text-gray-700 transition-all duration-200 hover:bg-gray-50 dark:border-zinc-800 dark:text-gray-300 dark:hover:bg-zinc-900/50"
                                            >
                                                <TrendingUp className="h-4 w-4 text-gray-400" />
                                                Kelola Kategori Masalah
                                            </Button>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
