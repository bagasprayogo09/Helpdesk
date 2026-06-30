import { Head, router, usePage, Deferred } from '@inertiajs/react';
import { Edit2, Plus, Tag, Trash2, Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import IssueCategoryController from '@/actions/App/Http/Controllers/Api/IssueCategory/IssueCategoryController';
import Heading from '@/components/app/heading';
import { IssueCategoryForm } from '@/components/issue-category/issue-category-form';
import { Pagination } from '@/components/pagination';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import * as issueRoutes from '@/routes/api/issue-categories';
import type { Divisi, IssueCategory, IssueCategoryPageProps } from '@/types';

export default function IssueCategoryIndex() {
    const { issueCategories, divisis } = usePage<IssueCategoryPageProps>().props;
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] =
        useState<IssueCategory | null>(null);

    const handleAdd = () => {
        setEditingCategory(null);
        setIsDialogOpen(true);
    };

    const handleEdit = (category: IssueCategory) => {
        setEditingCategory(category);
        setIsDialogOpen(true);
    };

    const handleDelete = (category: IssueCategory) => {
        if (confirm('Hapus kategori ini?')) {
            router.delete(IssueCategoryController.destroy.url(category.id));
        }
    };

    const categoryList = Array.isArray(issueCategories)
        ? issueCategories
        : issueCategories?.data || [];
    const divisiList = Array.isArray(divisis) ? divisis : divisis?.data || [];

    return (
        <div className="flex h-full flex-1 flex-col gap-8 p-6 lg:p-12">
            <Head title="Katalog Masalah" />

            <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-indigo-600"></span>
                <span className="text-xs font-black tracking-widest text-indigo-600 uppercase">
                    Catalog
                </span>
            </div>

            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <Heading
                    title="Katalog Masalah"
                    description="Kategorikan jenis bantuan teknis berdasarkan divisi terkait."
                />
                <Button
                    onClick={handleAdd}
                    className="h-12 rounded-xl bg-indigo-600 px-8 text-xs font-black tracking-widest text-white uppercase shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 active:scale-95 dark:shadow-none"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Kategori Baru
                </Button>
            </div>

            <div className="flex flex-col gap-px">
                {categoryList.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-[2.5rem] border-none bg-indigo-50/30 py-24 ring-1 ring-indigo-100 dark:bg-white/5 dark:ring-white/10">
                        <Tag className="mb-6 h-12 w-12 stroke-[1.5px] text-indigo-600/30" />
                        <p className="text-base font-bold text-gray-900 dark:text-white">
                            Belum ada kategori masalah
                        </p>
                        <p className="text-sm text-gray-500">
                            Mulai klasifikasikan tiket bantuan Anda
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col overflow-hidden rounded-[2.5rem] bg-white shadow-sm ring-1 ring-gray-100 dark:bg-white/5 dark:ring-white/10">
                        {categoryList.map((category, idx) => (
                            <div
                                key={category.id}
                                className={`group flex flex-col justify-between gap-4 p-6 transition-all hover:bg-gray-50/50 sm:flex-row sm:items-center sm:gap-6 sm:p-8 dark:hover:bg-white/[0.02] ${idx !== categoryList.length - 1 ? 'border-b border-gray-100 dark:border-white/5' : ''}`}
                            >
                                <div className="flex items-start gap-4 sm:gap-6">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <h3 className="text-base font-black tracking-tight text-gray-900 transition-colors group-hover:text-indigo-600 sm:text-lg dark:text-white">
                                                {category.name}
                                            </h3>
                                            <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[9px] font-black tracking-widest text-indigo-600 uppercase ring-1 ring-indigo-100 sm:py-1 sm:text-[10px] dark:bg-indigo-900/20 dark:ring-indigo-900/40">
                                                {category.divisi?.name}
                                            </span>
                                        </div>
                                        {category.description && (
                                            <p className="line-clamp-2 max-w-md text-xs leading-relaxed font-medium text-gray-500 sm:text-sm dark:text-gray-400">
                                                {category.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 self-end opacity-100 transition-opacity sm:self-auto sm:opacity-0 sm:group-hover:opacity-100">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-9 w-9 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-900/20"
                                        onClick={() => handleEdit(category)}
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-9 w-9 rounded-xl text-red-600 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                                        onClick={() => handleDelete(category)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                        <Pagination
                            links={issueCategories.links}
                            meta={issueCategories.meta}
                        />
                    </div>
                )}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <Deferred
                    data="divisis"
                    fallback={
                        <div className="flex items-center justify-center p-12">
                            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                        </div>
                    }
                >
                    <IssueCategoryForm
                        category={editingCategory}
                        divisis={divisiList}
                        onSuccess={() => setIsDialogOpen(false)}
                        onCancel={() => setIsDialogOpen(false)}
                    />
                </Deferred>
            </Dialog>
        </div>
    );
}

IssueCategoryIndex.layout = {
    breadcrumbs: [{ title: 'Katalog Masalah', href: issueRoutes.index() }],
};
