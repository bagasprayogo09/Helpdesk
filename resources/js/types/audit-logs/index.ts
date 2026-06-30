export interface AuditLog {
    id: number;
    user_id: number | null;
    user_name: string;
    event: string;
    auditable_type: string;
    auditable_id: number;
    old_values: Record<string, any> | null;
    new_values: Record<string, any> | null;
    description: string;
    ip_address: string | null;
    user_agent: string | null;
    created_at: string;
    created_at_human: string;
}

export interface AuditLogPageProps extends Record<string, unknown> {
    logs: {
        data: AuditLog[];
        links: any;
        meta: any;
    };
    filters: {
        search?: string;
        event?: string;
        type?: string;
    };
}
