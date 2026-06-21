import { Head, router, usePage } from '@inertiajs/react';
import { History, Search, Eye, Filter, Info, ShieldAlert, X, Shield, Globe } from 'lucide-react';
import React, { useState } from 'react';
import Heading from '@/components/app/heading';
import { Pagination } from '@/components/pagination';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface AuditLog {
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

interface PageProps extends Record<string, unknown> {
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

export default function AuditLogsIndex() {
    const { logs, filters } = usePage<PageProps>().props;
    const [searchValue, setSearchValue] = useState(filters.search || '');
    const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    const logList = logs.data || [];

    const handleFilterChange = (key: string, value: string) => {
        const currentParams: Record<string, any> = { ...filters };
        if (value && value !== 'all') {
            currentParams[key] = value;
        } else {
            delete currentParams[key];
        }

        // Keep search if exists
        if (searchValue) {
            currentParams.search = searchValue;
        } else {
            delete currentParams.search;
        }

        router.get('/audit-logs', currentParams, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const currentParams = { ...filters };
        if (searchValue) {
            currentParams.search = searchValue;
        } else {
            delete currentParams.search;
        }

        router.get('/audit-logs', currentParams, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleClearFilters = () => {
        setSearchValue('');
        router.get('/audit-logs');
    };

    const showDetails = (log: AuditLog) => {
        setSelectedLog(log);
        setIsDetailsOpen(true);
    };

    const getEventBadgeClass = (event: string) => {
        switch (event) {
            case 'created':
                return 'bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400 ring-1 ring-green-150/20';
            case 'updated':
                return 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 ring-1 ring-amber-150/20';
            case 'deleted':
                return 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400 ring-1 ring-red-150/20';
            default:
                return 'bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-400 ring-1 ring-gray-200';
        }
    };

    const getEventLabel = (event: string) => {
        switch (event) {
            case 'created':
                return 'Dibuat';
            case 'updated':
                return 'Diperbarui';
            case 'deleted':
                return 'Dihapus';
            default:
                return event;
        }
    };

    const formatValue = (val: any): string => {
        if (val === null || val === undefined) return 'NULL';
        if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
        if (typeof val === 'object') return JSON.stringify(val);
        return String(val);
    };

    // Filter keys we don't want to show in changes detail comparison (metadata/security fields)
    const ignoredKeys = ['created_at', 'updated_at', 'id', 'password', 'remember_token'];

    const renderChanges = (log: AuditLog) => {
        if (log.event === 'updated' && log.old_values && log.new_values) {
            const keys = Object.keys(log.new_values).filter(k => !ignoredKeys.includes(k));
            if (keys.length === 0) return <p className="text-xs text-gray-500 font-medium">Hanya perubahan metadata internal.</p>;

            return (
                <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-4 border-b border-gray-150 pb-2 text-[10px] font-black uppercase tracking-wider text-gray-400 dark:border-b-white/5">
                        <div>Properti</div>
                        <div>Nilai Lama</div>
                        <div>Nilai Baru</div>
                    </div>
                    <div className="divide-y divide-gray-50 dark:divide-white/5 space-y-2.5">
                        {keys.map((key) => {
                            const oldVal = formatValue(log.old_values?.[key]);
                            const newVal = formatValue(log.new_values?.[key]);
                            return (
                                <div key={key} className="grid grid-cols-3 gap-4 pt-2.5 text-xs">
                                    <div className="font-mono font-bold text-gray-700 dark:text-gray-300">{key}</div>
                                    <div className="rounded-lg bg-red-50/50 dark:bg-red-950/20 px-2 py-1 text-red-700 dark:text-red-400 font-mono text-[11px] break-all line-through decoration-red-300">
                                        {oldVal}
                                    </div>
                                    <div className="rounded-lg bg-green-50/50 dark:bg-green-950/20 px-2 py-1 text-green-700 dark:text-green-400 font-mono text-[11px] break-all">
                                        {newVal}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            );
        }

        if (log.event === 'created' && log.new_values) {
            const keys = Object.keys(log.new_values).filter(k => !ignoredKeys.includes(k));
            return (
                <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 border-b border-gray-150 pb-2 text-[10px] font-black uppercase tracking-wider text-gray-400 dark:border-b-white/5">
                        <div>Properti</div>
                        <div>Nilai Baru</div>
                    </div>
                    <div className="divide-y divide-gray-50 dark:divide-white/5 space-y-2.5">
                        {keys.map((key) => {
                            const newVal = formatValue(log.new_values?.[key]);
                            return (
                                <div key={key} className="grid grid-cols-2 gap-4 pt-2.5 text-xs">
                                    <div className="font-mono font-bold text-gray-700 dark:text-gray-300">{key}</div>
                                    <div className="rounded-lg bg-green-50/50 dark:bg-green-950/20 px-2 py-1 text-green-700 dark:text-green-400 font-mono text-[11px] break-all">
                                        {newVal}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            );
        }

        if (log.event === 'deleted' && log.old_values) {
            const keys = Object.keys(log.old_values).filter(k => !ignoredKeys.includes(k));
            return (
                <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 border-b border-gray-150 pb-2 text-[10px] font-black uppercase tracking-wider text-gray-400 dark:border-b-white/5">
                        <div>Properti</div>
                        <div>Nilai yang Dihapus</div>
                    </div>
                    <div className="divide-y divide-gray-50 dark:divide-white/5 space-y-2.5">
                        {keys.map((key) => {
                            const oldVal = formatValue(log.old_values?.[key]);
                            return (
                                <div key={key} className="grid grid-cols-2 gap-4 pt-2.5 text-xs">
                                    <div className="font-mono font-bold text-gray-700 dark:text-gray-300">{key}</div>
                                    <div className="rounded-lg bg-red-50/50 dark:bg-red-950/20 px-2 py-1 text-red-700 dark:text-red-400 font-mono text-[11px] break-all">
                                        {oldVal}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            );
        }

        return <p className="text-xs text-gray-500 font-medium">Tidak ada detail perubahan data.</p>;
    };

    return (
        <div className="flex h-full flex-1 flex-col gap-8 p-6 lg:p-12">
            <Head title="Audit Log" />

            <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-indigo-600"></span>
                <span className="text-xs font-black tracking-widest text-indigo-600 uppercase">
                    Security & History
                </span>
            </div>

            <Heading
                title="Log Audit"
                description="Catatan riwayat perubahan data dan aktivitas penting pada sistem helpdesk."
            />

            {/* Filter Section */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                <form onSubmit={handleSearchSubmit} className="relative flex-1">
                    <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        placeholder="Cari deskripsi aktivitas..."
                        className="h-12 w-full rounded-2xl border-none bg-white pl-12 pr-4 text-sm font-semibold shadow-sm ring-1 ring-gray-100 placeholder:text-gray-400 focus-visible:ring-indigo-600 dark:bg-white/5 dark:ring-white/10 dark:focus-visible:ring-indigo-500"
                    />
                </form>

                <div className="flex flex-wrap gap-3">
                    {/* Event Filter */}
                    <div className="min-w-[150px]">
                        <Select
                            value={filters.event || 'all'}
                            onValueChange={(val) => handleFilterChange('event', val)}
                        >
                            <SelectTrigger className="h-12 rounded-2xl border-none bg-white px-4 text-xs font-black tracking-wider uppercase text-gray-600 shadow-sm ring-1 ring-gray-100 dark:bg-white/5 dark:ring-white/10 dark:text-gray-300">
                                <SelectValue placeholder="Pilih Aksi" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-none bg-white shadow-xl dark:bg-neutral-900">
                                <SelectItem value="all">Semua Aksi</SelectItem>
                                <SelectItem value="created">Dibuat</SelectItem>
                                <SelectItem value="updated">Diperbarui</SelectItem>
                                <SelectItem value="deleted">Dihapus</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Object Type Filter */}
                    <div className="min-w-[150px]">
                        <Select
                            value={filters.type || 'all'}
                            onValueChange={(val) => handleFilterChange('type', val)}
                        >
                            <SelectTrigger className="h-12 rounded-2xl border-none bg-white px-4 text-xs font-black tracking-wider uppercase text-gray-600 shadow-sm ring-1 ring-gray-100 dark:bg-white/5 dark:ring-white/10 dark:text-gray-300">
                                <SelectValue placeholder="Pilih Objek" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-none bg-white shadow-xl dark:bg-neutral-900">
                                <SelectItem value="all">Semua Objek</SelectItem>
                                <SelectItem value="ticket">Tiket</SelectItem>
                                <SelectItem value="divisi">Divisi</SelectItem>
                                <SelectItem value="category">Kategori Masalah</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {(filters.search || filters.event || filters.type) && (
                        <Button
                            variant="ghost"
                            onClick={handleClearFilters}
                            className="h-12 rounded-2xl px-6 text-xs font-black tracking-wider uppercase text-red-600 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20"
                        >
                            Reset
                        </Button>
                    )}
                </div>
            </div>

            {/* Table / List Card */}
            <Card className="overflow-hidden rounded-[2rem] border-none bg-white shadow-sm ring-1 ring-gray-100 dark:bg-white/5 dark:ring-white/10">
                <CardContent className="p-0">
                    {/* Mobile View */}
                    <div className="block divide-y divide-gray-100 sm:hidden dark:divide-white/5">
                        {logList.length === 0 ? (
                            <div className="px-8 py-24 text-center">
                                <div className="flex flex-col items-center gap-4 opacity-40">
                                    <div className="flex aspect-square size-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20">
                                        <History className="h-8 w-8" />
                                    </div>
                                    <div>
                                        <p className="text-base font-bold">Belum ada aktivitas</p>
                                        <p className="text-sm">Riwayat perubahan data akan terekam di sini</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            logList.map((log) => (
                                <div key={log.id} className="flex flex-col gap-3 p-6">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-xs font-bold text-gray-950 dark:text-white">
                                                {log.user_name}
                                            </span>
                                            <span className="font-mono text-[10px] text-gray-400">
                                                {log.created_at_human}
                                            </span>
                                        </div>
                                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[8px] font-black tracking-wider uppercase ${getEventBadgeClass(log.event)}`}>
                                            {getEventLabel(log.event)}
                                        </span>
                                    </div>
                                    <p className="text-xs font-medium text-gray-600 dark:text-gray-300">
                                        {log.description}
                                    </p>
                                    <div className="flex items-center justify-between text-[9px] text-gray-400 font-mono mt-1">
                                        <span>IP: {log.ip_address || '-'}</span>
                                        <span>Tipe: {log.auditable_type}</span>
                                    </div>
                                    <div className="flex justify-end pt-1">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 gap-1.5 rounded-lg text-xs font-bold hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-900/20"
                                            onClick={() => showDetails(log)}
                                        >
                                            <Eye className="h-3.5 w-3.5" />
                                            Detail Perubahan
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Desktop View */}
                    <div className="hidden overflow-x-auto sm:block">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-gray-100 transition-colors dark:border-white/5 bg-gray-50/20 dark:bg-white/[0.01]">
                                    <th className="px-8 py-5 text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase">
                                        Aktor
                                    </th>
                                    <th className="px-8 py-5 text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase">
                                        Aksi / Objek
                                    </th>
                                    <th className="px-8 py-5 text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase">
                                        Deskripsi Aktivitas
                                    </th>
                                    <th className="px-8 py-5 text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase">
                                        IP / Metadata
                                    </th>
                                    <th className="px-8 py-5 text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase">
                                        Waktu
                                    </th>
                                    <th className="px-8 py-5 text-right text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                                {logList.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-24 text-center">
                                            <div className="flex flex-col items-center gap-4 opacity-40">
                                                <div className="flex aspect-square size-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20">
                                                    <History className="h-8 w-8" />
                                                </div>
                                                <div>
                                                    <p className="text-base font-bold">Belum ada aktivitas</p>
                                                    <p className="text-sm">Riwayat perubahan data akan terekam di sini</p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    logList.map((log) => (
                                        <tr
                                            key={log.id}
                                            className="group transition-all duration-200 hover:bg-gray-50/50 dark:hover:bg-white/[0.02]"
                                        >
                                            <td className="px-8 py-6">
                                                <div className="font-bold text-gray-900 dark:text-white">
                                                    {log.user_name}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col items-start gap-1">
                                                    <span className={`inline-flex rounded-full px-2 py-0.5 text-[9px] font-black tracking-wider uppercase ${getEventBadgeClass(log.event)}`}>
                                                        {getEventLabel(log.event)}
                                                    </span>
                                                    <span className="font-mono text-[9px] text-gray-400">
                                                        {log.auditable_type}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="max-w-[320px] leading-relaxed font-bold text-gray-800 dark:text-gray-200">
                                                    {log.description}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col font-mono text-[10px] text-gray-400 gap-0.5">
                                                    <span>IP: {log.ip_address || '-'}</span>
                                                    <span className="max-w-[150px] truncate" title={log.user_agent || ''}>
                                                        {log.user_agent || '-'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="font-medium text-xs text-gray-850 dark:text-gray-200">
                                                        {log.created_at}
                                                    </span>
                                                    <span className="font-mono text-[9px] text-gray-400">
                                                        {log.created_at_human}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-10 w-10 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-900/20"
                                                    onClick={() => showDetails(log)}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    <Pagination links={logs.links} meta={logs.meta} />
                </CardContent>
            </Card>

            {/* Details Modal */}
            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <DialogContent className="max-w-2xl overflow-hidden rounded-[2.5rem] border-none bg-white p-8 shadow-2xl dark:bg-neutral-900 ring-1 ring-gray-150 dark:ring-white/10">
                    <DialogHeader className="mb-6">
                        <div className="flex items-center gap-3">
                            <div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20">
                                <History className="h-5 w-5" />
                            </div>
                            <div>
                                <DialogTitle className="text-lg font-black tracking-tight text-gray-900 dark:text-white">
                                    Detail Perubahan Data
                                </DialogTitle>
                                <DialogDescription className="text-xs font-semibold text-gray-500">
                                    Melihat perbandingan nilai data sebelum dan sesudah perubahan.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    {selectedLog && (
                        <div className="space-y-6">
                            {/* Metadata Summary */}
                            <div className="grid grid-cols-2 gap-4 rounded-2xl bg-gray-50/50 dark:bg-white/[0.02] p-4 text-xs">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1">
                                        Pelaku Aksi
                                    </p>
                                    <p className="font-bold text-gray-900 dark:text-white">
                                        {selectedLog.user_name}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1">
                                        Waktu Aksi
                                    </p>
                                    <p className="font-bold text-gray-900 dark:text-white">
                                        {selectedLog.created_at}
                                    </p>
                                </div>
                                <div className="col-span-2 border-t border-gray-100 dark:border-white/5 pt-2">
                                    <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1">
                                        Deskripsi
                                    </p>
                                    <p className="font-bold text-gray-800 dark:text-gray-200">
                                        {selectedLog.description}
                                    </p>
                                </div>
                                <div className="col-span-2 border-t border-gray-100 dark:border-white/5 pt-2 flex justify-between gap-6 font-mono text-[9px] text-gray-400">
                                    <span>IP Address: {selectedLog.ip_address || '-'}</span>
                                    <span className="truncate max-w-[300px]" title={selectedLog.user_agent || ''}>
                                        User Agent: {selectedLog.user_agent || '-'}
                                    </span>
                                </div>
                            </div>

                            {/* Comparison list */}
                            <div className="max-h-[300px] overflow-y-auto pr-1">
                                {renderChanges(selectedLog)}
                            </div>

                            <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-white/5">
                                <Button
                                    onClick={() => setIsDetailsOpen(false)}
                                    className="h-10 rounded-xl bg-gray-100 dark:bg-white/5 font-bold text-xs uppercase px-6 hover:bg-gray-200 dark:hover:bg-white/10 dark:text-white"
                                >
                                    Tutup
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}

// Layout wrapping
AuditLogsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Log Audit',
            href: '/audit-logs',
        },
    ],
};
