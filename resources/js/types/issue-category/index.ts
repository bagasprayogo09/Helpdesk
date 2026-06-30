import type { Divisi } from '../divisi';

export interface IssueCategory {
    id: number;
    divisi_id: number;
    name: string;
    description: string | null;
    divisi?: Divisi;
    created_at?: string;
    updated_at?: string;
}

export interface IssueCategoryPageProps extends Record<string, unknown> {
    issueCategories: {
        data: IssueCategory[];
        links: any;
        meta: any;
    };
    divisis: { data: Divisi[] };
}
