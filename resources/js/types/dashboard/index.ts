import type { CalendarEvent } from '@/components/tickets/calendar';

export interface TicketStats {
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

export interface DashboardProps {
    stats: TicketStats;
}
