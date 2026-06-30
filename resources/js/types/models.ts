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
