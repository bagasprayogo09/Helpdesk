import Heading from '@/components/app/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import * as ticketRoutes from '@/routes/tickets';
import { Head, Link } from '@inertiajs/react';
import {
    Building,
    Tag,
    User,
    Calendar,
    Clock,
    ArrowLeft,
    Pencil,
    ShieldAlert,
} from 'lucide-react';

interface Ticket {
    id: number;
    ticket_number: string;
    subject: string;
    description: string;
    status: {
        value: string;
        label: string;
        color: string;
    };
    priority: {
        value: string;
        label: string;
        color: string;
    };
    user: {
        id: number;
        name: string;
    };
    divisi: {
        id: number;
        name: string;
    };
    issue_category: {
        id: number;
        name: string;
    };
    assigned_to: {
        id: number;
        name: string;
    } | null;
    resolved_at: string | null;
    closed_at: string | null;
    created_at: string;
    updated_at: string;
}

interface Props {
    ticket: {
        data: Ticket;
    };
}

export default function TicketShow({ ticket }: Props) {
    const data = ticket.data;

    const getStatusColor = (color: string) => {
        switch (color) {
            case 'blue':
                return 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 ring-1 ring-blue-100 dark:ring-blue-900/40';
            case 'yellow':
                return 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400 ring-1 ring-yellow-100 dark:ring-yellow-900/40';
            case 'orange':
                return 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400 ring-1 ring-orange-100 dark:ring-orange-900/40';
            case 'green':
                return 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 ring-1 ring-green-100 dark:ring-green-900/40';
            case 'gray':
                return 'bg-gray-50 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400 ring-1 ring-gray-100 dark:ring-gray-800';
            default:
                return '';
        }
    };

    const getPriorityColor = (color: string) => {
        switch (color) {
            case 'red':
                return 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 ring-1 ring-red-100 dark:ring-red-900/40';
            case 'orange':
                return 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400 ring-1 ring-orange-100 dark:ring-orange-900/40';
            case 'blue':
                return 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 ring-1 ring-blue-100 dark:ring-blue-900/40';
            case 'gray':
                return 'bg-gray-50 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400 ring-1 ring-gray-100 dark:ring-gray-800';
            default:
                return '';
        }
    };

    return (
        <>
            <Head title={`Ticket ${data.ticket_number}`} />
            <div className="flex h-full flex-1 flex-col gap-8 p-6 lg:p-12">
                <div className="flex items-center gap-3">
                    <Link
                        href={ticketRoutes.index()}
                        className="flex items-center gap-2 text-xs font-bold tracking-widest text-gray-400 uppercase transition-colors hover:text-indigo-600"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to List
                    </Link>
                </div>

                <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <div className="mb-2 flex items-center gap-3">
                            <span className="font-mono text-sm font-black text-indigo-600 dark:text-indigo-400">
                                {data.ticket_number}
                            </span>
                            <Badge
                                variant="outline"
                                className={`rounded-full px-3 py-1 text-[10px] font-black tracking-widest uppercase ${getStatusColor(data.status.color)}`}
                            >
                                {data.status.label}
                            </Badge>
                            <Badge
                                variant="outline"
                                className={`rounded-full px-3 py-1 text-[10px] font-black tracking-widest uppercase ${getPriorityColor(data.priority.color)}`}
                            >
                                {data.priority.label}
                            </Badge>
                        </div>
                        <Heading
                            title={data.subject}
                            description={`Reported by ${data.user.name}`}
                        />
                    </div>
                    <Link href={ticketRoutes.edit({ ticket: data.id })}>
                        <Button className="h-12 rounded-xl bg-indigo-600 px-8 text-xs font-black tracking-widest text-white uppercase shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 active:scale-95 dark:shadow-none">
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit Ticket
                        </Button>
                    </Link>
                </div>

                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Left Details Column */}
                    <div className="flex flex-col gap-6 lg:col-span-2">
                        <Card className="overflow-hidden rounded-[2rem] border-none bg-white p-6 shadow-sm ring-1 ring-gray-100 lg:p-8 dark:bg-white/5 dark:ring-white/10">
                            <CardHeader className="mb-6 p-0">
                                <CardTitle className="text-lg font-black tracking-wider text-gray-900 uppercase dark:text-white">
                                    Description
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <p className="leading-relaxed whitespace-pre-wrap text-gray-600 dark:text-gray-300">
                                    {data.description}
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Metadata Column */}
                    <div className="flex flex-col gap-6">
                        <Card className="overflow-hidden rounded-[2rem] border-none bg-white p-6 shadow-sm ring-1 ring-gray-100 dark:bg-white/5 dark:ring-white/10">
                            <CardHeader className="mb-6 border-b border-gray-50 p-0 pb-4 dark:border-white/5">
                                <CardTitle className="text-sm font-black tracking-widest text-gray-400 uppercase">
                                    Ticket Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-6 p-0">
                                {/* Division */}
                                <div className="flex items-start gap-4">
                                    <div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400">
                                        <Building className="h-5 w-5" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black tracking-widest text-gray-400 uppercase">
                                            Division
                                        </span>
                                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                                            {data.divisi.name}
                                        </span>
                                    </div>
                                </div>

                                {/* Issue Category */}
                                <div className="flex items-start gap-4">
                                    <div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400">
                                        <Tag className="h-5 w-5" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black tracking-widest text-gray-400 uppercase">
                                            Category
                                        </span>
                                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                                            {data.issue_category.name}
                                        </span>
                                    </div>
                                </div>

                                {/* Assigned To */}
                                <div className="flex items-start gap-4">
                                    <div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400">
                                        <User className="h-5 w-5" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black tracking-widest text-gray-400 uppercase">
                                            Assigned Agent
                                        </span>
                                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                                            {data.assigned_to
                                                ? data.assigned_to.name
                                                : 'Not Assigned Yet'}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-4 border-t border-gray-50 pt-6 dark:border-white/5">
                                    {/* Created At */}
                                    <div className="flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-2 font-bold tracking-wider text-gray-400 uppercase">
                                            <Calendar className="h-3.5 w-3.5" />
                                            Created
                                        </div>
                                        <span className="font-bold text-gray-900 dark:text-white">
                                            {data.created_at}
                                        </span>
                                    </div>

                                    {/* Updated At */}
                                    <div className="flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-2 font-bold tracking-wider text-gray-400 uppercase">
                                            <Clock className="h-3.5 w-3.5" />
                                            Updated
                                        </div>
                                        <span className="font-bold text-gray-900 dark:text-white">
                                            {data.updated_at}
                                        </span>
                                    </div>

                                    {/* Resolved At */}
                                    {data.resolved_at && (
                                        <div className="flex items-center justify-between text-xs">
                                            <div className="flex items-center gap-2 font-bold tracking-wider text-gray-400 uppercase">
                                                <ShieldAlert className="h-3.5 w-3.5 text-green-500" />
                                                Resolved
                                            </div>
                                            <span className="font-bold text-green-600 dark:text-green-400">
                                                {data.resolved_at}
                                            </span>
                                        </div>
                                    )}

                                    {/* Closed At */}
                                    {data.closed_at && (
                                        <div className="flex items-center justify-between text-xs">
                                            <div className="flex items-center gap-2 font-bold tracking-wider text-gray-400 uppercase">
                                                <ShieldAlert className="h-3.5 w-3.5 text-gray-500" />
                                                Closed
                                            </div>
                                            <span className="font-bold text-gray-600 dark:text-gray-400">
                                                {data.closed_at}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

TicketShow.layout = {
    breadcrumbs: [
        {
            title: 'Tickets',
            href: ticketRoutes.index(),
        },
        {
            title: 'Detail Tiket',
            href: '#',
        },
    ],
};
