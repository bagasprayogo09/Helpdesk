export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    role: 'admin' | 'supervisor' | 'approver' | 'petugas' | 'user';
    role_label: string;
    created_at?: string;
    updated_at?: string;
}

export interface Divisi {
    id: number;
    name: string;
    description: string | null;
    created_at?: string;
    updated_at?: string;
}

export interface IssueCategory {
    id: number;
    divisi_id: number;
    name: string;
    description: string | null;
    divisi?: Divisi;
    created_at?: string;
    updated_at?: string;
}
