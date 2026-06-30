export interface Divisi {
    id: number;
    name: string;
    description: string | null;
    created_at?: string;
    updated_at?: string;
}

export interface DivisiPageProps extends Record<string, unknown> {
    divisis: {
        data: Divisi[];
        links: any;
        meta: any;
    };
}
