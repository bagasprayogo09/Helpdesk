import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationProps {
    links: PaginationLink[] | Record<string, any> | null | undefined;
    meta?: {
        current_page?: number;
        from?: number;
        last_page?: number;
        per_page?: number;
        to?: number;
        total?: number;
        links?: PaginationLink[];
    };
    className?: string;
}

export function Pagination({ links, meta, className = '' }: PaginationProps) {
    const resolvedLinks = Array.isArray(links)
        ? links
        : meta && Array.isArray(meta.links)
          ? meta.links
          : [];

    if (resolvedLinks.length <= 3) return null; // Don't show pagination if there's only 1 page (prev, 1, next)

    const cleanLabel = (label: string) => {
        if (label.includes('Previous')) {
            return <ChevronLeft className="h-4 w-4" />;
        }
        if (label.includes('Next')) {
            return <ChevronRight className="h-4 w-4" />;
        }
        return label;
    };

    // Extract pagination metadata for mobile view
    const activeLinkIndex = resolvedLinks.findIndex((l) => l.active);
    const currentPage =
        meta?.current_page ||
        (activeLinkIndex !== -1
            ? parseInt(resolvedLinks[activeLinkIndex].label) || 1
            : 1);
    const totalPages =
        meta?.last_page ||
        (resolvedLinks.length > 2
            ? parseInt(resolvedLinks[resolvedLinks.length - 2].label) || 1
            : 1);

    const prevLink = resolvedLinks[0];
    const nextLink = resolvedLinks[resolvedLinks.length - 1];

    return (
        <div
            className={`border-t border-gray-100 px-8 py-5 dark:border-white/5 ${className}`}
        >
            {/* Mobile View */}
            <div className="flex w-full items-center justify-between sm:hidden">
                {prevLink &&
                    (prevLink.url === null ? (
                        <span className="flex h-9 cursor-not-allowed items-center justify-center rounded-xl border border-gray-50 bg-gray-50/50 px-3.5 text-xs font-bold text-gray-300 dark:border-transparent dark:bg-white/[0.01] dark:text-gray-600">
                            <ChevronLeft className="mr-1 h-4 w-4" />
                            Prev
                        </span>
                    ) : (
                        <Link
                            href={prevLink.url}
                            preserveScroll
                            className="flex h-9 items-center justify-center rounded-xl border border-gray-100 bg-white px-3.5 text-xs font-bold text-gray-600 transition-all hover:border-indigo-600 hover:text-indigo-600 dark:border-white/5 dark:bg-white/5 dark:text-gray-300 dark:hover:border-white/20 dark:hover:text-white"
                        >
                            <ChevronLeft className="mr-1 h-4 w-4" />
                            Prev
                        </Link>
                    ))}

                <span className="font-mono text-xs font-bold text-gray-700 dark:text-gray-300">
                    Hal {currentPage} / {totalPages}
                </span>

                {nextLink &&
                    (nextLink.url === null ? (
                        <span className="flex h-9 cursor-not-allowed items-center justify-center rounded-xl border border-gray-50 bg-gray-50/50 px-3.5 text-xs font-bold text-gray-300 dark:border-transparent dark:bg-white/[0.01] dark:text-gray-600">
                            Next
                            <ChevronRight className="ml-1 h-4 w-4" />
                        </span>
                    ) : (
                        <Link
                            href={nextLink.url}
                            preserveScroll
                            className="flex h-9 items-center justify-center rounded-xl border border-gray-100 bg-white px-3.5 text-xs font-bold text-gray-600 transition-all hover:border-indigo-600 hover:text-indigo-600 dark:border-white/5 dark:bg-white/5 dark:text-gray-300 dark:hover:border-white/20 dark:hover:text-white"
                        >
                            Next
                            <ChevronRight className="ml-1 h-4 w-4" />
                        </Link>
                    ))}
            </div>

            {/* Desktop View */}
            <div className="hidden w-full flex-row items-center justify-between gap-4 sm:flex">
                {meta && meta.total !== undefined && (
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        Menampilkan{' '}
                        <span className="font-bold text-gray-900 dark:text-white">
                            {meta.from}
                        </span>{' '}
                        sampai{' '}
                        <span className="font-bold text-gray-900 dark:text-white">
                            {meta.to}
                        </span>{' '}
                        dari{' '}
                        <span className="font-bold text-gray-900 dark:text-white">
                            {meta.total}
                        </span>{' '}
                        data
                    </div>
                )}

                <nav
                    className="flex items-center gap-1.5"
                    aria-label="Pagination"
                >
                    {resolvedLinks.map((link, key) => {
                        const isPrevNext =
                            link.label.includes('Previous') ||
                            link.label.includes('Next');

                        if (link.url === null) {
                            return (
                                <span
                                    key={key}
                                    className={`flex h-9 min-w-9 cursor-not-allowed items-center justify-center rounded-xl border border-gray-50 bg-gray-50/50 text-xs font-bold text-gray-300 dark:border-transparent dark:bg-white/[0.01] dark:text-gray-600`}
                                >
                                    {cleanLabel(link.label)}
                                </span>
                            );
                        }

                        return (
                            <Link
                                key={key}
                                href={link.url}
                                preserveScroll
                                className={`flex h-9 min-w-9 items-center justify-center rounded-xl border text-xs font-bold transition-all ${
                                    link.active
                                        ? 'border-indigo-600 bg-indigo-600 text-white shadow-md shadow-indigo-100 dark:shadow-none'
                                        : 'border-gray-100 bg-white text-gray-600 hover:border-indigo-600 hover:text-indigo-600 dark:border-white/5 dark:bg-white/5 dark:text-gray-300 dark:hover:border-white/20 dark:hover:text-white'
                                } ${isPrevNext ? 'px-3' : ''}`}
                            >
                                {cleanLabel(link.label)}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}
