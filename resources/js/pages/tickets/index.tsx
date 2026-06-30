import { Head, Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import Heading from '@/components/app/heading';
import { Pagination } from '@/components/pagination';
import { TicketCard } from '@/components/tickets/ticket-card';
import { TicketTable } from '@/components/tickets/ticket-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import * as ticketRoutes from '@/routes/api/tickets';

import type { TicketProps } from '@/types';

export default function TicketIndex({ tickets }: TicketProps) {
    return (
        <>
            <Head title="Tickets" />
            <div className="flex h-full flex-1 flex-col gap-8 p-6 lg:p-12">
                <div className="flex items-center gap-3">
                    <span className="h-px w-8 bg-indigo-600"></span>
                    <span className="text-xs font-black tracking-widest text-indigo-600 uppercase">
                        Support
                    </span>
                </div>

                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <Heading
                        title="Helpdesk Tickets"
                        description="Manage and track all support requests in one place."
                    />
                    <Link href="/tickets/create" prefetch>
                        <Button className="h-12 rounded-xl bg-indigo-600 px-8 text-xs font-black tracking-widest text-white uppercase shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 active:scale-95 dark:shadow-none">
                            <Plus className="mr-2 h-4 w-4" />
                            Create Ticket
                        </Button>
                    </Link>
                </div>

                <Card className="overflow-hidden rounded-[2rem] border-none bg-white shadow-sm ring-1 ring-gray-100 dark:bg-white/5 dark:ring-white/10">
                    <CardContent className="p-0">
                        {/* Mobile View (Card List) */}
                        <div className="block divide-y divide-gray-100 sm:hidden dark:divide-white/5">
                            {tickets.data.length === 0 ? (
                                <div className="px-8 py-24 text-center font-bold text-muted-foreground">
                                    No tickets found.
                                </div>
                            ) : (
                                tickets.data.map((ticket) => (
                                    <TicketCard
                                        key={ticket.id}
                                        ticket={ticket}
                                    />
                                ))
                            )}
                        </div>

                        {/* Desktop View (Table) */}
                        <TicketTable tickets={tickets.data} />

                        <Pagination links={tickets.links} meta={tickets.meta} />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

TicketIndex.layout = {
    breadcrumbs: [
        {
            title: 'Tickets',
            href: ticketRoutes.index(),
        },
    ],
};
