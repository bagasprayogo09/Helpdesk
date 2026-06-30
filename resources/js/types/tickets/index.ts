import type { Divisi } from '../divisi';
import type { IssueCategory } from '../issue-category';

export interface Ticket {
    id: number;
    ticket_number: string;
    subject: string;
    description?: string;
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
    assigned_to?: {
        id: number;
        name: string;
    } | null;
    resolved_at?: string | null;
    closed_at?: string | null;
    created_at: string;
    updated_at?: string;
}

export interface TicketProps {
    tickets: {
        data: Ticket[];
        links: any;
        meta: any;
    };
}

export interface Agent {
    id: number;
    name: string;
}

export interface TicketCreateProps {
    divisis: Divisi[];
    issue_categories: IssueCategory[];
}

export interface TicketEditProps {
    ticket: {
        data: Ticket;
    };
    divisis: Divisi[];
    issue_categories: IssueCategory[];
    agents: Agent[];
}

export interface TicketShowProps {
    ticket: {
        data: Ticket;
    };
}
