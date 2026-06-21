import { Button } from '@/components/ui/button';
import * as ticketRoutes from '@/routes/tickets';
import { Ticket } from '@/types/ticket';
import { Link } from '@inertiajs/react';
import { Building, Eye, Pencil, Tag, Trash2 } from 'lucide-react';
import { TicketPriorityBadge, TicketStatusBadge } from './ticket-badges';

interface TicketTableProps {
    tickets: Ticket[];
}

export function TicketTable({ tickets }: TicketTableProps) {
    return (
        <div className="hidden overflow-x-auto sm:block">
            <table className="w-full text-left text-sm">
                <thead>
                    <tr className="border-b border-gray-100 transition-colors dark:border-white/5">
                        <th className="px-8 py-5 text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase">
                            Ticket Info
                        </th>
                        <th className="px-8 py-5 text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase">
                            Status & Priority
                        </th>
                        <th className="px-8 py-5 text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase">
                            Requester
                        </th>
                        <th className="px-8 py-5 text-right text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                    {tickets.length === 0 ? (
                        <tr>
                            <td
                                colSpan={4}
                                className="px-8 py-24 text-center font-bold text-muted-foreground"
                            >
                                No tickets found.
                            </td>
                        </tr>
                    ) : (
                        tickets.map((ticket) => (
                            <tr
                                key={ticket.id}
                                className="group transition-all duration-200 hover:bg-gray-50/50 dark:hover:bg-white/[0.02]"
                            >
                                <td className="px-8 py-6">
                                    <div className="flex flex-col gap-1">
                                        <span className="font-mono text-xs font-black text-indigo-600 dark:text-indigo-400">
                                            {ticket.ticket_number}
                                        </span>
                                        <span className="leading-tight font-bold text-gray-900 dark:text-white">
                                            {ticket.subject}
                                        </span>
                                        <div className="mt-1 flex items-center gap-2">
                                            <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase">
                                                <Building className="h-3 w-3" />
                                                {ticket.divisi.name}
                                            </div>
                                            <span className="text-gray-300">
                                                •
                                            </span>
                                            <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase">
                                                <Tag className="h-3 w-3" />
                                                {ticket.issue_category.name}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex flex-col gap-2">
                                        <TicketStatusBadge
                                            status={ticket.status}
                                        />
                                        <TicketPriorityBadge
                                            priority={ticket.priority}
                                        />
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                                            {ticket.user.name}
                                        </span>
                                        <span className="text-[10px] font-bold tracking-tight text-gray-400 uppercase">
                                            {ticket.created_at}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex justify-end gap-2">
                                        <Link
                                            href={ticketRoutes.show({
                                                ticket: ticket.id,
                                            })}
                                            prefetch
                                        >
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-10 w-10 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-900/20"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Link
                                            href={ticketRoutes.edit({
                                                ticket: ticket.id,
                                            })}
                                            prefetch
                                        >
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-10 w-10 rounded-xl hover:bg-slate-50 hover:text-slate-600 dark:hover:bg-slate-800"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-10 w-10 rounded-xl hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
