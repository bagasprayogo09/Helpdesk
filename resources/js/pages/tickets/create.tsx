import Heading from '@/components/app/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import * as ticketRoutes from '@/routes/api/tickets';
import { Head, Link, Form } from '@inertiajs/react';
import { ArrowLeft, Plus } from 'lucide-react';
import React, { useState, useEffect } from 'react';

interface Divisi {
    id: number;
    name: string;
}

interface IssueCategory {
    id: number;
    divisi_id: number;
    name: string;
}

interface Props {
    divisis: Divisi[];
    issue_categories: IssueCategory[];
}

export default function TicketCreate({
    divisis = [],
    issue_categories = [],
}: Props) {
    const [selectedDivisi, setSelectedDivisi] = useState<string>('');
    const [filteredCategories, setFilteredCategories] = useState<
        IssueCategory[]
    >([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedPriority, setSelectedPriority] = useState<string>('medium');

    // Filter categories when division changes
    useEffect(() => {
        if (selectedDivisi) {
            const divisiId = parseInt(selectedDivisi);
            const filtered = issue_categories.filter(
                (cat) => cat.divisi_id === divisiId,
            );
            setFilteredCategories(filtered);
            setSelectedCategory(''); // Reset category selection
        } else {
            setFilteredCategories([]);
            setSelectedCategory('');
        }
    }, [selectedDivisi, issue_categories]);

    return (
        <>
            <Head title="Create Ticket" />
            <div className="flex h-full flex-1 flex-col gap-8 p-6 lg:p-12">
                <div className="flex items-center gap-3">
                    <Link
                        href={ticketRoutes.index()}
                        className="flex items-center gap-2 text-xs font-bold tracking-widest text-gray-400 uppercase transition-colors hover:text-indigo-600"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to List
                    </Link>
                </div>

                <div className="flex flex-col gap-6">
                    <Heading
                        title="Create New Ticket"
                        description="Report a new issue or request support from a department."
                    />
                </div>

                <Card className="max-w-3xl overflow-hidden rounded-[2rem] border-none bg-white shadow-sm ring-1 ring-gray-100 dark:bg-white/5 dark:ring-white/10">
                    <CardContent className="p-8">
                        <Form
                            action={ticketRoutes.store.url()}
                            method="post"
                            resetOnSuccess
                            options={{
                                preserveScroll: true,
                            }}
                            className="space-y-6"
                        >
                            {({ processing, errors }) => {
                                // Sync local state changes
                                const handleDivisiChange = (val: string) => {
                                    setSelectedDivisi(val);
                                };

                                const handleCategoryChange = (val: string) => {
                                    setSelectedCategory(val);
                                };

                                const handlePriorityChange = (val: string) => {
                                    setSelectedPriority(val);
                                };

                                return (
                                    <>
                                        {/* Divisi Selection */}
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="divisi_id"
                                                className="text-xs font-black tracking-widest text-gray-400 uppercase"
                                            >
                                                Target Division
                                            </Label>
                                            <Select
                                                value={selectedDivisi}
                                                onValueChange={
                                                    handleDivisiChange
                                                }
                                            >
                                                <SelectTrigger className="h-12 rounded-xl border-none bg-gray-50 px-4 text-sm font-bold shadow-sm ring-1 ring-gray-100 dark:bg-white/5 dark:ring-white/10">
                                                    <SelectValue placeholder="Select target division" />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-xl border-none bg-white shadow-xl dark:bg-neutral-900">
                                                    {divisis.map((divisi) => (
                                                        <SelectItem
                                                            key={divisi.id}
                                                            value={divisi.id.toString()}
                                                        >
                                                            {divisi.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <input
                                                type="hidden"
                                                name="divisi_id"
                                                value={selectedDivisi}
                                            />
                                            <InputError
                                                message={errors.divisi_id}
                                            />
                                        </div>

                                        {/* Issue Category Selection */}
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="issue_category_id"
                                                className="text-xs font-black tracking-widest text-gray-400 uppercase"
                                            >
                                                Issue Category
                                            </Label>
                                            <Select
                                                value={selectedCategory}
                                                onValueChange={
                                                    handleCategoryChange
                                                }
                                                disabled={!selectedDivisi}
                                            >
                                                <SelectTrigger className="h-12 rounded-xl border-none bg-gray-50 px-4 text-sm font-bold shadow-sm ring-1 ring-gray-100 disabled:opacity-50 dark:bg-white/5 dark:ring-white/10">
                                                    <SelectValue
                                                        placeholder={
                                                            selectedDivisi
                                                                ? 'Select category'
                                                                : 'Please select target division first'
                                                        }
                                                    />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-xl border-none bg-white shadow-xl dark:bg-neutral-900">
                                                    {filteredCategories.map(
                                                        (cat) => (
                                                            <SelectItem
                                                                key={cat.id}
                                                                value={cat.id.toString()}
                                                            >
                                                                {cat.name}
                                                            </SelectItem>
                                                        ),
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <input
                                                type="hidden"
                                                name="issue_category_id"
                                                value={selectedCategory}
                                            />
                                            <InputError
                                                message={
                                                    errors.issue_category_id
                                                }
                                            />
                                        </div>

                                        {/* Priority Selection */}
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="priority"
                                                className="text-xs font-black tracking-widest text-gray-400 uppercase"
                                            >
                                                Priority
                                            </Label>
                                            <Select
                                                value={selectedPriority}
                                                onValueChange={
                                                    handlePriorityChange
                                                }
                                            >
                                                <SelectTrigger className="h-12 rounded-xl border-none bg-gray-50 px-4 text-sm font-bold shadow-sm ring-1 ring-gray-100 dark:bg-white/5 dark:ring-white/10">
                                                    <SelectValue placeholder="Select priority" />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-xl border-none bg-white shadow-xl dark:bg-neutral-900">
                                                    <SelectItem value="low">
                                                        Rendah (Low)
                                                    </SelectItem>
                                                    <SelectItem value="medium">
                                                        Sedang (Medium)
                                                    </SelectItem>
                                                    <SelectItem value="high">
                                                        Tinggi (High)
                                                    </SelectItem>
                                                    <SelectItem value="urgent">
                                                        Mendesak (Urgent)
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <input
                                                type="hidden"
                                                name="priority"
                                                value={selectedPriority}
                                            />
                                            <InputError
                                                message={errors.priority}
                                            />
                                        </div>

                                        {/* Subject */}
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="subject"
                                                className="text-xs font-black tracking-widest text-gray-400 uppercase"
                                            >
                                                Subject / Title
                                            </Label>
                                            <Input
                                                id="subject"
                                                name="subject"
                                                placeholder="e.g., Cannot connect to printer or Database error"
                                                className="h-12 rounded-xl border-none bg-gray-50 px-4 text-sm font-bold shadow-sm ring-1 ring-gray-100 transition-all focus:ring-2 focus:ring-indigo-600 dark:bg-white/5 dark:ring-white/10"
                                                required
                                            />
                                            <InputError
                                                message={errors.subject}
                                            />
                                        </div>

                                        {/* Description */}
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="description"
                                                className="text-xs font-black tracking-widest text-gray-400 uppercase"
                                            >
                                                Detailed Description
                                            </Label>
                                            <textarea
                                                id="description"
                                                name="description"
                                                rows={6}
                                                placeholder="Please provide details about the problem you are experiencing..."
                                                className="w-full rounded-xl border-none bg-gray-50 p-4 text-sm font-bold shadow-sm ring-1 ring-gray-100 transition-all focus:ring-2 focus:ring-indigo-600 focus:outline-none dark:bg-white/5 dark:ring-white/10"
                                                required
                                            />
                                            <InputError
                                                message={errors.description}
                                            />
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex items-center justify-end gap-4 pt-4">
                                            <Link href={ticketRoutes.index()}>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    className="h-12 rounded-xl px-6 text-xs font-black tracking-widest uppercase hover:bg-gray-100 dark:hover:bg-neutral-800"
                                                >
                                                    Cancel
                                                </Button>
                                            </Link>
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                                className="h-12 rounded-xl bg-indigo-600 px-8 text-xs font-black tracking-widest text-white uppercase shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 active:scale-95 dark:shadow-none"
                                            >
                                                {processing
                                                    ? 'Submitting...'
                                                    : 'Create Ticket'}
                                            </Button>
                                        </div>
                                    </>
                                );
                            }}
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

TicketCreate.layout = {
    breadcrumbs: [
        {
            title: 'Tickets',
            href: ticketRoutes.index(),
        },
        {
            title: 'Buat Tiket Baru',
            href: '#',
        },
    ],
};
