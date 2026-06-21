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
import { Head, Link, Form, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
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

interface Agent {
    id: number;
    name: string;
}

interface Ticket {
    id: number;
    ticket_number: string;
    subject: string;
    description: string;
    status: {
        value: string;
        label: string;
        color: string;
    };
    priority: {
        value: string;
        label: string;
        color: string;
    };
    user: {
        id: number;
        name: string;
    };
    divisi: {
        id: number;
        name: string;
    };
    issue_category: {
        id: number;
        name: string;
    };
    assigned_to: {
        id: number;
        name: string;
    } | null;
}

interface Props {
    ticket: {
        data: Ticket;
    };
    divisis: Divisi[];
    issue_categories: IssueCategory[];
    agents: Agent[];
}

export default function TicketEdit({
    ticket,
    divisis = [],
    issue_categories = [],
    agents = [],
}: Props) {
    const data = ticket.data;
    const { auth } = usePage().props as any;
    const userRole = auth?.user?.role;
    const isStaff = ['admin', 'supervisor', 'approver', 'petugas'].includes(
        userRole,
    );

    const [selectedDivisi, setSelectedDivisi] = useState<string>(
        data.divisi.id.toString(),
    );
    const [filteredCategories, setFilteredCategories] = useState<
        IssueCategory[]
    >([]);
    const [selectedCategory, setSelectedCategory] = useState<string>(
        data.issue_category.id.toString(),
    );
    const [selectedPriority, setSelectedPriority] = useState<string>(
        data.priority.value,
    );
    const [selectedStatus, setSelectedStatus] = useState<string>(
        data.status.value,
    );
    const [selectedAgent, setSelectedAgent] = useState<string>(
        data.assigned_to?.id.toString() || 'none',
    );

    // Filter categories when division changes
    useEffect(() => {
        if (selectedDivisi) {
            const divisiId = parseInt(selectedDivisi);
            const filtered = issue_categories.filter(
                (cat) => cat.divisi_id === divisiId,
            );
            setFilteredCategories(filtered);
        } else {
            setFilteredCategories([]);
        }
    }, [selectedDivisi, issue_categories]);

    return (
        <>
            <Head title={`Edit Ticket ${data.ticket_number}`} />
            <div className="flex h-full flex-1 flex-col gap-8 p-6 lg:p-12">
                <div className="flex items-center gap-3">
                    <Link
                        href={ticketRoutes.show({ ticket: data.id })}
                        className="flex items-center gap-2 text-xs font-bold tracking-widest text-gray-400 uppercase transition-colors hover:text-indigo-600"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Detail
                    </Link>
                </div>

                <div className="flex flex-col gap-6">
                    <Heading
                        title={`Edit Ticket ${data.ticket_number}`}
                        description="Update ticket information, status, priority, or assign support staff."
                    />
                </div>

                <Card className="max-w-3xl overflow-hidden rounded-[2rem] border-none bg-white shadow-sm ring-1 ring-gray-100 dark:bg-white/5 dark:ring-white/10">
                    <CardContent className="p-8">
                        <Form
                            action={ticketRoutes.update.url({
                                ticket: data.id,
                            })}
                            method="put"
                            options={{
                                preserveScroll: true,
                            }}
                            className="space-y-6"
                        >
                            {({ processing, errors }) => {
                                const handleDivisiChange = (val: string) => {
                                    setSelectedDivisi(val);
                                    // Reset category to empty if the previous category is not under the new division
                                    const divisiId = parseInt(val);
                                    const belongsToDivisi =
                                        issue_categories.find(
                                            (cat) =>
                                                cat.id ===
                                                    parseInt(
                                                        selectedCategory,
                                                    ) &&
                                                cat.divisi_id === divisiId,
                                        );
                                    if (!belongsToDivisi) {
                                        setSelectedCategory('');
                                    }
                                };

                                const handleCategoryChange = (val: string) => {
                                    setSelectedCategory(val);
                                };

                                const handlePriorityChange = (val: string) => {
                                    setSelectedPriority(val);
                                };

                                const handleStatusChange = (val: string) => {
                                    setSelectedStatus(val);
                                };

                                const handleAgentChange = (val: string) => {
                                    setSelectedAgent(val);
                                };

                                return (
                                    <>
                                        {/* Standard Fields (Only editable if user is creator or staff) */}
                                        <div className="grid gap-6 md:grid-cols-2">
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
                                                        {divisis.map(
                                                            (divisi) => (
                                                                <SelectItem
                                                                    key={
                                                                        divisi.id
                                                                    }
                                                                    value={divisi.id.toString()}
                                                                >
                                                                    {
                                                                        divisi.name
                                                                    }
                                                                </SelectItem>
                                                            ),
                                                        )}
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
                                                                    : 'Please select division first'
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
                                        </div>

                                        {/* Staff-Only Fields */}
                                        {isStaff && (
                                            <div className="grid gap-6 border-t border-gray-50 pt-6 md:grid-cols-3 dark:border-white/5">
                                                {/* Status Selection */}
                                                <div className="space-y-2">
                                                    <Label
                                                        htmlFor="status"
                                                        className="text-xs font-black tracking-widest text-gray-400 uppercase"
                                                    >
                                                        Status
                                                    </Label>
                                                    <Select
                                                        value={selectedStatus}
                                                        onValueChange={
                                                            handleStatusChange
                                                        }
                                                    >
                                                        <SelectTrigger className="h-12 rounded-xl border-none bg-gray-50 px-4 text-sm font-bold shadow-sm ring-1 ring-gray-100 dark:bg-white/5 dark:ring-white/10">
                                                            <SelectValue placeholder="Select status" />
                                                        </SelectTrigger>
                                                        <SelectContent className="rounded-xl border-none bg-white shadow-xl dark:bg-neutral-900">
                                                            <SelectItem value="open">
                                                                Terbuka (Open)
                                                            </SelectItem>
                                                            <SelectItem value="pending">
                                                                Menunggu
                                                                (Pending)
                                                            </SelectItem>
                                                            <SelectItem value="in_progress">
                                                                Sedang
                                                                Dikerjakan (In
                                                                Progress)
                                                            </SelectItem>
                                                            <SelectItem value="resolved">
                                                                Selesai
                                                                (Resolved)
                                                            </SelectItem>
                                                            <SelectItem value="closed">
                                                                Ditutup (Closed)
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <input
                                                        type="hidden"
                                                        name="status"
                                                        value={selectedStatus}
                                                    />
                                                    <InputError
                                                        message={errors.status}
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
                                                                Mendesak
                                                                (Urgent)
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <input
                                                        type="hidden"
                                                        name="priority"
                                                        value={selectedPriority}
                                                    />
                                                    <InputError
                                                        message={
                                                            errors.priority
                                                        }
                                                    />
                                                </div>

                                                {/* Agent Assignment Selection */}
                                                <div className="space-y-2">
                                                    <Label
                                                        htmlFor="assigned_to"
                                                        className="text-xs font-black tracking-widest text-gray-400 uppercase"
                                                    >
                                                        Assign Agent
                                                    </Label>
                                                    <Select
                                                        value={selectedAgent}
                                                        onValueChange={
                                                            handleAgentChange
                                                        }
                                                    >
                                                        <SelectTrigger className="h-12 rounded-xl border-none bg-gray-50 px-4 text-sm font-bold shadow-sm ring-1 ring-gray-100 dark:bg-white/5 dark:ring-white/10">
                                                            <SelectValue placeholder="Select agent" />
                                                        </SelectTrigger>
                                                        <SelectContent className="rounded-xl border-none bg-white shadow-xl dark:bg-neutral-900">
                                                            <SelectItem value="none">
                                                                Belum Ditugaskan
                                                            </SelectItem>
                                                            {agents.map(
                                                                (agent) => (
                                                                    <SelectItem
                                                                        key={
                                                                            agent.id
                                                                        }
                                                                        value={agent.id.toString()}
                                                                    >
                                                                        {
                                                                            agent.name
                                                                        }
                                                                    </SelectItem>
                                                                ),
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                    <input
                                                        type="hidden"
                                                        name="assigned_to"
                                                        value={
                                                            selectedAgent ===
                                                            'none'
                                                                ? ''
                                                                : selectedAgent
                                                        }
                                                    />
                                                    <InputError
                                                        message={
                                                            errors.assigned_to
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* Subject */}
                                        <div className="space-y-2 border-t border-gray-50 pt-6 dark:border-white/5">
                                            <Label
                                                htmlFor="subject"
                                                className="text-xs font-black tracking-widest text-gray-400 uppercase"
                                            >
                                                Subject / Title
                                            </Label>
                                            <Input
                                                id="subject"
                                                name="subject"
                                                defaultValue={data.subject}
                                                placeholder="e.g., Cannot connect to printer"
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
                                                defaultValue={data.description}
                                                placeholder="Provide detailed description of your issue..."
                                                className="w-full rounded-xl border-none bg-gray-50 p-4 text-sm font-bold shadow-sm ring-1 ring-gray-100 transition-all focus:ring-2 focus:ring-indigo-600 focus:outline-none dark:bg-white/5 dark:ring-white/10"
                                                required
                                            />
                                            <InputError
                                                message={errors.description}
                                            />
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex items-center justify-end gap-4 pt-4">
                                            <Link
                                                href={ticketRoutes.show({
                                                    ticket: data.id,
                                                })}
                                            >
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
                                                    ? 'Saving...'
                                                    : 'Save Changes'}
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

TicketEdit.layout = {
    breadcrumbs: [
        {
            title: 'Tickets',
            href: ticketRoutes.index(),
        },
        {
            title: 'Edit Tiket',
            href: '#',
        },
    ],
};
