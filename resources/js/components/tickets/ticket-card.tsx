import { Link } from '@inertiajs/react';
import { Building, Eye, Pencil, Tag, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as ticketRoutes from '@/routes/tickets';
import type { Ticket } from '@/types';
import { TicketPriorityBadge, TicketStatusBadge } from './ticket-badges';

interface TicketCardProps {
    ticket: Ticket;
}

export function TicketCard({ ticket }: TicketCardProps) {
    return (
        <div className="flex flex-col gap-4 p-6">
            <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <span className="font-mono text-xs font-black text-indigo-600 dark:text-indigo-400">
                        {ticket.ticket_number}
                    </span>
                    <span className="leading-tight font-bold text-gray-900 dark:text-white">
                        {ticket.subject}
                    </span>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                    <TicketStatusBadge status={ticket.status} />
                    <TicketPriorityBadge priority={ticket.priority} />
                </div>
            </div>

            <div className="flex items-center justify-between text-xs font-medium text-gray-500 dark:text-gray-400">
                <div className="flex flex-col">
                    <span className="font-bold text-gray-900 dark:text-white">
                        {ticket.user.name}
                    </span>
                    <span className="text-[10px]">{ticket.created_at}</span>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <span className="flex items-center gap-1 text-[9px] font-bold tracking-wider text-gray-400 uppercase">
                        <Building className="h-3 w-3" />
                        {ticket.divisi.name}
                    </span>
                    <span className="flex items-center gap-1 text-[9px] font-bold tracking-wider text-gray-400 uppercase">
                        <Tag className="h-3 w-3" />
                        {ticket.issue_category.name}
                    </span>
                </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-gray-100 pt-3 dark:border-white/5">
                <Link href={ticketRoutes.show({ ticket: ticket.id })} prefetch>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 rounded-xl text-xs font-bold hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-900/20"
                    >
                        <Eye className="mr-1.5 h-3.5 w-3.5" />
                        Detail
                    </Button>
                </Link>
                <Link href={ticketRoutes.edit({ ticket: ticket.id })} prefetch>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 rounded-xl text-xs font-bold hover:bg-slate-50 hover:text-slate-600 dark:hover:bg-slate-800"
                    >
                        <Pencil className="mr-1.5 h-3.5 w-3.5" />
                        Edit
                    </Button>
                </Link>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                >
                    <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                    Hapus
                </Button>
            </div>
        </div>
    );
}
