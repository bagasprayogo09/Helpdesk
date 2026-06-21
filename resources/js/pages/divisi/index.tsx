import { Head, router, usePage } from '@inertiajs/react';
import { Building, Edit2, MoreVertical, Plus, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import DivisiController from '@/actions/App/Http/Controllers/Api/Divisi/DivisiController';
import Heading from '@/components/app/heading';
import { DivisiForm } from '@/components/divisi/divisi-form';
import { Pagination } from '@/components/pagination';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import * as divisiRoutes from '@/routes/api/divisi';
import { Divisi } from '@/types';

interface PageProps extends Record<string, unknown> {
    divisis: {
        data: Divisi[];
        links: any;
        meta: any;
    };
}

export default function DivisiIndex() {
    const { divisis } = usePage<PageProps>().props;
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingDivisi, setEditingDivisi] = useState<Divisi | null>(null);

    const handleAdd = () => {
        setEditingDivisi(null);
        setIsDialogOpen(true);
    };

    const handleEdit = (divisi: Divisi) => {
        setEditingDivisi(divisi);
        setIsDialogOpen(true);
    };

    const handleDelete = (divisi: Divisi) => {
        if (confirm('Apakah Anda yakin ingin menghapus divisi ini?')) {
            router.delete(DivisiController.destroy.url(divisi.id));
        }
    };

    const divisiList = Array.isArray(divisis) ? divisis : divisis.data;

    return (
        <div className="flex h-full flex-1 flex-col gap-8 p-6 lg:p-12">
            <Head title="Divisi" />

            <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-indigo-600"></span>
                <span className="text-xs font-black tracking-widest text-indigo-600 uppercase">
                    Management
                </span>
            </div>

            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <Heading
                    title="Divisi"
                    description="Kelola struktur departemen dan unit kerja organisasi."
                />
                <Button
                    onClick={handleAdd}
                    className="h-12 rounded-xl bg-indigo-600 px-8 text-xs font-black tracking-widest text-white uppercase shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 active:scale-95 dark:shadow-none"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Divisi
                </Button>
            </div>

            <Card className="overflow-hidden rounded-[2rem] border-none bg-white shadow-sm ring-1 ring-gray-100 dark:bg-white/5 dark:ring-white/10">
                <CardContent className="p-0">
                    {/* Mobile View (Card List) */}
                    <div className="block divide-y divide-gray-100 sm:hidden dark:divide-white/5">
                        {divisiList.length === 0 ? (
                            <div className="px-8 py-24 text-center">
                                <div className="flex flex-col items-center gap-4 opacity-40">
                                    <div className="flex aspect-square size-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20">
                                        <Building className="h-8 w-8" />
                                    </div>
                                    <div>
                                        <p className="text-base font-bold">
                                            Belum ada divisi
                                        </p>
                                        <p className="text-sm">
                                            Mulai bangun struktur organisasi
                                            Anda
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            divisiList.map((divisi) => (
                                <div
                                    key={divisi.id}
                                    className="flex flex-col gap-3 p-6"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="text-base font-bold text-gray-900 dark:text-white">
                                            {divisi.name}
                                        </div>
                                        <div className="flex gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-9 w-9 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-900/20"
                                                onClick={() =>
                                                    handleEdit(divisi)
                                                }
                                            >
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-9 w-9 rounded-xl text-red-600 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                                                onClick={() =>
                                                    handleDelete(divisi)
                                                }
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    {divisi.description && (
                                        <p className="text-sm leading-relaxed font-medium text-gray-500 dark:text-gray-400">
                                            {divisi.description}
                                        </p>
                                    )}
                                </div>
                            ))
                        )}
                    </div>

                    {/* Desktop View (Table) */}
                    <div className="hidden overflow-x-auto sm:block">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-gray-100 transition-colors dark:border-white/5">
                                    <th className="px-8 py-5 text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase">
                                        Nama Divisi
                                    </th>
                                    <th className="px-8 py-5 text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase">
                                        Deskripsi
                                    </th>
                                    <th className="px-8 py-5 text-right text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                                {divisiList.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={3}
                                            className="px-8 py-24 text-center"
                                        >
                                            <div className="flex flex-col items-center gap-4 opacity-40">
                                                <div className="flex aspect-square size-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20">
                                                    <Building className="h-8 w-8" />
                                                </div>
                                                <div>
                                                    <p className="text-base font-bold">
                                                        Belum ada divisi
                                                    </p>
                                                    <p className="text-sm">
                                                        Mulai bangun struktur
                                                        organisasi Anda
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    divisiList.map((divisi) => (
                                        <tr
                                            key={divisi.id}
                                            className="group transition-all duration-200 hover:bg-gray-50/50 dark:hover:bg-white/[0.02]"
                                        >
                                            <td className="px-8 py-6">
                                                <div className="font-bold text-gray-900 dark:text-white">
                                                    {divisi.name}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="max-w-[400px] truncate font-medium text-gray-500 dark:text-gray-400">
                                                    {divisi.description || '-'}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger
                                                        asChild
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-10 w-10 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-900/20"
                                                        >
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent
                                                        align="end"
                                                        className="w-[180px] rounded-xl border-none shadow-2xl ring-1 ring-gray-100 dark:ring-white/10"
                                                    >
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                handleEdit(
                                                                    divisi,
                                                                )
                                                            }
                                                            className="cursor-pointer rounded-lg py-3 font-bold"
                                                        >
                                                            <Edit2 className="mr-2 h-4 w-4" />
                                                            <span>
                                                                Edit Detail
                                                            </span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                handleDelete(
                                                                    divisi,
                                                                )
                                                            }
                                                            className="cursor-pointer rounded-lg py-3 font-bold text-red-600 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-900/20"
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            <span>
                                                                Hapus Divisi
                                                            </span>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    <Pagination links={divisis.links} meta={divisis.meta} />
                </CardContent>
            </Card>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DivisiForm
                    divisi={editingDivisi}
                    onSuccess={() => setIsDialogOpen(false)}
                    onCancel={() => setIsDialogOpen(false)}
                />
            </Dialog>
        </div>
    );
}

DivisiIndex.layout = {
    breadcrumbs: [
        {
            title: 'Divisi',
            href: divisiRoutes.index(),
        },
    ],
};
