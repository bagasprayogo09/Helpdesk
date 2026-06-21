import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
    Clock,
    CheckCircle2,
    PlusCircle,
} from 'lucide-react';
import React, { useState } from 'react';

export interface CalendarEvent {
    id: string;
    ticket_id: number;
    title: string;
    description: string;
    date: string; // YYYY-MM-DD
    type: 'created' | 'in_progress' | 'closed';
    color: string;
}

interface CalendarProps {
    events: CalendarEvent[];
    compact?: boolean;
}

export function TicketCalendar({ events, compact = false }: CalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

    const daysInMonth = (year: number, month: number) =>
        new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year: number, month: number) =>
        new Date(year, month, 1).getDay();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const monthName = currentDate.toLocaleString('id-ID', { month: 'long' });

    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    const numDays = daysInMonth(year, month);
    const startDay = firstDayOfMonth(year, month);

    const days = [];
    // Padding for previous month
    for (let i = 0; i < startDay; i++) {
        days.push(null);
    }
    // Days of current month
    for (let i = 1; i <= numDays; i++) {
        days.push(i);
    }

    const getEventsForDay = (day: number) => {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return events.filter((event) => event.date === dateStr);
    };

    const getEventIcon = (type: string) => {
        switch (type) {
            case 'created':
                return <PlusCircle className="h-3 w-3 text-blue-500" />;
            case 'in_progress':
                return <Clock className="h-3 w-3 text-orange-500" />;
            case 'closed':
                return <CheckCircle2 className="h-3 w-3 text-gray-500" />;
            default:
                return null;
        }
    };

    const getEventColorClass = (type: string) => {
        switch (type) {
            case 'created':
                return 'bg-blue-550/10 text-blue-600 ring-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:ring-blue-900/40';
            case 'in_progress':
                return 'bg-orange-50 text-orange-600 ring-orange-100 dark:bg-orange-900/20 dark:text-orange-400 dark:ring-orange-900/40';
            case 'closed':
                return 'bg-gray-50 text-gray-600 ring-gray-100 dark:bg-gray-900/20 dark:text-gray-400 dark:ring-gray-800';
            default:
                return '';
        }
    };

    const selectedDateEvents = selectedDate
        ? events.filter((event) => {
              const dateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
              return event.date === dateStr;
          })
        : [];

    return (
        <Card className="overflow-hidden rounded-[2.5rem] border-none bg-white shadow-sm ring-1 ring-gray-100 dark:bg-white/5 dark:ring-white/10">
            <CardHeader className="flex flex-row items-center justify-between border-b border-gray-100 px-8 py-6 dark:border-white/5">
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                        <CardTitle className="text-lg font-black tracking-tight text-gray-900 dark:text-white">
                            Kalender Tiket
                        </CardTitle>
                    </div>
                    {!compact && (
                        <CardDescription className="text-xs font-medium text-gray-500">
                            Aktivitas tiket berdasarkan tanggal.
                        </CardDescription>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={prevMonth}
                        className="h-9 w-9 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="min-w-[100px] text-center text-xs font-black tracking-wider text-gray-900 uppercase dark:text-white">
                        {monthName} {year}
                    </span>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={nextMonth}
                        className="h-9 w-9 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="grid grid-cols-7 border-b border-gray-100 dark:border-white/5">
                    {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(
                        (day) => (
                            <div
                                key={day}
                                className="bg-gray-50/50 py-3 text-center text-[10px] font-black tracking-widest text-gray-400 uppercase dark:bg-white/[0.01]"
                            >
                                {day}
                            </div>
                        ),
                    )}
                </div>
                <div
                    className={`grid grid-cols-7 ${compact ? 'auto-rows-[48px]' : 'auto-rows-[120px]'}`}
                >
                    {days.map((day, i) => {
                        const dayEvents = day ? getEventsForDay(day) : [];
                        const isToday =
                            day &&
                            new Date().toDateString() ===
                                new Date(year, month, day).toDateString();

                        const isSelected =
                            day &&
                            selectedDate &&
                            selectedDate.getDate() === day &&
                            selectedDate.getMonth() === month &&
                            selectedDate.getFullYear() === year;

                        return (
                            <div
                                key={i}
                                onClick={() =>
                                    day &&
                                    setSelectedDate(new Date(year, month, day))
                                }
                                className={`relative flex flex-col gap-1 border-r border-b border-gray-100 p-2 transition-colors dark:border-white/5 ${
                                    !day
                                        ? 'pointer-events-none bg-gray-50/30 dark:bg-transparent'
                                        : 'cursor-pointer hover:bg-gray-50/50 dark:hover:bg-white/[0.02]'
                                } ${isSelected ? 'bg-indigo-50/20 dark:bg-indigo-950/10' : ''}`}
                            >
                                {day && (
                                    <>
                                        {compact ? (
                                            <div className="flex h-full flex-col items-center justify-between py-0.5">
                                                <span
                                                    className={`font-mono text-xs font-bold ${
                                                        isSelected
                                                            ? 'flex h-5 w-5 items-center justify-center rounded-lg bg-indigo-600 font-black text-white shadow-md'
                                                            : isToday
                                                              ? 'flex h-5 w-5 items-center justify-center rounded-lg border border-indigo-600 font-black text-indigo-600 dark:text-indigo-400'
                                                              : 'text-gray-700 dark:text-gray-300'
                                                    }`}
                                                >
                                                    {day}
                                                </span>
                                                <div className="flex min-h-[4px] w-full justify-center gap-0.5">
                                                    {dayEvents
                                                        .slice(0, 3)
                                                        .map((event) => (
                                                            <span
                                                                key={event.id}
                                                                className={`h-1 w-1 rounded-full ${
                                                                    event.type ===
                                                                    'created'
                                                                        ? 'bg-blue-500'
                                                                        : event.type ===
                                                                            'in_progress'
                                                                          ? 'bg-orange-500'
                                                                          : 'bg-gray-400 dark:bg-gray-500'
                                                                }`}
                                                            />
                                                        ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <span
                                                    className={`font-mono text-xs font-black ${
                                                        isToday
                                                            ? 'flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none'
                                                            : 'text-gray-400'
                                                    }`}
                                                >
                                                    {day}
                                                </span>
                                                <div className="scrollbar-hide mt-1 flex max-h-[85px] flex-col gap-1 overflow-y-auto">
                                                    {dayEvents
                                                        .slice(0, 3)
                                                        .map((event) => (
                                                            <div
                                                                key={event.id}
                                                                className={`flex items-center gap-1.5 truncate rounded-lg px-2 py-1 text-[9px] font-bold ring-1 ring-inset ${getEventColorClass(event.type)}`}
                                                                title={
                                                                    event.title
                                                                }
                                                            >
                                                                {getEventIcon(
                                                                    event.type,
                                                                )}
                                                                <span className="truncate">
                                                                    {
                                                                        event.title
                                                                    }
                                                                </span>
                                                            </div>
                                                        ))}
                                                    {dayEvents.length > 3 && (
                                                        <span className="pl-2 text-[8px] font-black tracking-tight text-gray-400 uppercase">
                                                            +
                                                            {dayEvents.length -
                                                                3}{' '}
                                                            lainnya
                                                        </span>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Selected Day Events List for Compact Mode */}
                {compact && selectedDate && (
                    <div className="border-t border-gray-100 bg-gray-50/10 p-6 dark:border-white/5 dark:bg-transparent">
                        <h4 className="mb-3 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                            Aktivitas -{' '}
                            {selectedDate.toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                            })}
                        </h4>
                        {selectedDateEvents.length === 0 ? (
                            <p className="text-xs font-medium text-gray-400 italic">
                                Tidak ada aktivitas pada tanggal ini.
                            </p>
                        ) : (
                            <div className="flex max-h-[160px] flex-col gap-2 overflow-y-auto pr-1">
                                {selectedDateEvents.map((event) => (
                                    <div
                                        key={event.id}
                                        className={`flex items-start gap-2.5 rounded-xl p-2.5 ring-1 ring-inset ${getEventColorClass(event.type)}`}
                                    >
                                        <div className="mt-0.5">
                                            {getEventIcon(event.type)}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-xs font-bold">
                                                {event.title}
                                            </p>
                                            <p className="mt-0.5 line-clamp-2 text-[10px] opacity-80">
                                                {event.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Legend */}
                <div className="flex flex-wrap gap-4 border-t border-gray-100 bg-gray-50/50 p-6 dark:border-white/5 dark:bg-white/[0.01]">
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-blue-500 shadow-sm shadow-blue-200" />
                        <span className="text-[10px] font-black tracking-widest text-gray-500 uppercase">
                            Dibuat
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-orange-500 shadow-sm shadow-orange-200" />
                        <span className="text-[10px] font-black tracking-widest text-gray-500 uppercase">
                            Diproses
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-gray-500 shadow-sm shadow-gray-200" />
                        <span className="text-[10px] font-black tracking-widest text-gray-500 uppercase">
                            Ditutup
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
