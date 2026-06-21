export interface Ticket {
    id: number;
    ticket_number: string;
    subject: string;
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
    created_at: string;
}

export interface TicketProps {
    tickets: {
        data: Ticket[];
        links: any;
        meta: any;
    };
}
