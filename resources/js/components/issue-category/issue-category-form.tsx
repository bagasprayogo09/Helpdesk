import { Form } from '@inertiajs/react';
import { Building } from 'lucide-react';
import IssueCategoryController from '@/actions/App/Http/Controllers/Api/IssueCategory/IssueCategoryController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Divisi, IssueCategory } from '@/types';

interface IssueCategoryFormProps {
    category: IssueCategory | null;
    divisis: Divisi[];
    onSuccess: () => void;
    onCancel: () => void;
}

export function IssueCategoryForm({
    category,
    divisis,
    onSuccess,
    onCancel,
}: IssueCategoryFormProps) {
    return (
        <DialogContent className="rounded-[2.5rem] border-none bg-white p-8 shadow-2xl ring-1 ring-gray-100 sm:max-w-[425px] dark:bg-[#0a0a0a] dark:ring-white/10">
            <DialogHeader className="gap-2">
                <div className="flex items-center gap-2">
                    <span className="h-px w-6 bg-indigo-600"></span>
                    <span className="text-[10px] font-black tracking-widest text-indigo-600 uppercase">
                        Configuration
                    </span>
                </div>
                <DialogTitle className="text-2xl font-black tracking-tight">
                    {category ? 'Edit Kategori' : 'Kategori Baru'}
                </DialogTitle>
                <DialogDescription className="font-medium text-gray-500 dark:text-gray-400">
                    {category
                        ? 'Perbarui klasifikasi masalah untuk sistem pelaporan bantuan.'
                        : 'Definisikan jenis masalah baru agar pelaporan tiket lebih terarah.'}
                </DialogDescription>
            </DialogHeader>

            <Form
                {...(category
                    ? IssueCategoryController.update.form(category.id)
                    : IssueCategoryController.store.form())}
                onSuccess={onSuccess}
                resetOnSuccess
                options={{ preserveScroll: true }}
                className="space-y-6 pt-4"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="divisi_id"
                                    className="text-xs font-black tracking-widest text-gray-400 uppercase"
                                >
                                    Asosiasi Divisi
                                </Label>
                                <div className="relative">
                                    <select
                                        id="divisi_id"
                                        name="divisi_id"
                                        defaultValue={category?.divisi_id || ''}
                                        className="flex h-12 w-full cursor-pointer appearance-none rounded-xl border-none bg-gray-50 px-4 text-sm font-bold shadow-sm ring-1 ring-gray-100 transition-all focus:ring-2 focus:ring-indigo-600 dark:bg-white/5 dark:ring-white/10"
                                        required
                                    >
                                        <option value="" disabled>
                                            Pilih Penanggung Jawab
                                        </option>
                                        {divisis.map((divisi) => (
                                            <option
                                                key={divisi.id}
                                                value={divisi.id}
                                            >
                                                {divisi.name}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                                        <Building className="h-4 w-4" />
                                    </div>
                                </div>
                                <InputError message={errors.divisi_id} />
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="name"
                                    className="text-xs font-black tracking-widest text-gray-400 uppercase"
                                >
                                    Nama Kategori
                                </Label>
                                <Input
                                    id="name"
                                    name="name"
                                    defaultValue={category?.name}
                                    placeholder="Misal: Bug Software, Hardware Rusak"
                                    className="h-12 rounded-xl border-none bg-gray-50 px-4 text-sm font-bold shadow-sm ring-1 ring-gray-100 transition-all focus:ring-2 focus:ring-indigo-600 dark:bg-white/5 dark:ring-white/10"
                                    required
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="description"
                                    className="text-xs font-black tracking-widest text-gray-400 uppercase"
                                >
                                    Definisi Masalah
                                </Label>
                                <Input
                                    id="description"
                                    name="description"
                                    defaultValue={category?.description || ''}
                                    placeholder="Penjelasan singkat mengenai kategori ini..."
                                    className="h-12 rounded-xl border-none bg-gray-50 px-4 text-sm font-bold shadow-sm ring-1 ring-gray-100 transition-all focus:ring-2 focus:ring-indigo-600 dark:bg-white/5 dark:ring-white/10"
                                />
                                <InputError message={errors.description} />
                            </div>
                        </div>

                        <DialogFooter className="mt-8 gap-3 sm:gap-0">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={onCancel}
                                className="h-12 rounded-xl px-6 text-xs font-black tracking-widest uppercase"
                            >
                                Batal
                            </Button>
                            <Button
                                disabled={processing}
                                className="h-12 rounded-xl bg-indigo-600 px-8 text-xs font-black tracking-widest text-white uppercase shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 active:scale-95 dark:shadow-none"
                            >
                                {category ? 'Simpan' : 'Terbitkan'}
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </Form>
        </DialogContent>
    );
}
