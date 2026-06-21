import { Form } from '@inertiajs/react';
import DivisiController from '@/actions/App/Http/Controllers/Api/Divisi/DivisiController';
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
import { Divisi } from '@/types';

interface DivisiFormProps {
    divisi: Divisi | null;
    onSuccess: () => void;
    onCancel: () => void;
}

export function DivisiForm({ divisi, onSuccess, onCancel }: DivisiFormProps) {
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
                    {divisi ? 'Edit Divisi' : 'Tambah Divisi'}
                </DialogTitle>
                <DialogDescription className="font-medium text-gray-500 dark:text-gray-400">
                    {divisi
                        ? 'Sesuaikan informasi departemen atau unit kerja organisasi.'
                        : 'Masukkan nama dan keterangan divisi baru untuk manajemen internal.'}
                </DialogDescription>
            </DialogHeader>

            <Form
                {...(divisi
                    ? DivisiController.update.form(divisi.id)
                    : DivisiController.store.form())}
                onSuccess={onSuccess}
                resetOnSuccess
                options={{
                    preserveScroll: true,
                }}
                className="space-y-6 pt-4"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="name"
                                    className="text-xs font-black tracking-widest text-gray-400 uppercase"
                                >
                                    Nama Divisi
                                </Label>
                                <Input
                                    id="name"
                                    name="name"
                                    defaultValue={divisi?.name}
                                    placeholder="Contoh: IT Support"
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
                                    Keterangan Divisi
                                </Label>
                                <Input
                                    id="description"
                                    name="description"
                                    defaultValue={divisi?.description || ''}
                                    placeholder="Deskripsi singkat peran divisi"
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
                                {divisi
                                    ? 'Simpan Perubahan'
                                    : 'Daftarkan Divisi'}
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </Form>
        </DialogContent>
    );
}
