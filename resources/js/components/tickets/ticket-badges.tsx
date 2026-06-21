import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
    status: {
        label: string;
        color: string;
    };
    className?: string;
}

export function TicketStatusBadge({ status, className }: StatusBadgeProps) {
    const getStatusColor = (color: string) => {
        switch (color) {
            case 'blue':
                return 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 ring-1 ring-blue-100 dark:ring-blue-900/40';
            case 'yellow':
                return 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400 ring-1 ring-yellow-100 dark:ring-yellow-900/40';
            case 'orange':
                return 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400 ring-1 ring-orange-100 dark:ring-orange-900/40';
            case 'green':
                return 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 ring-1 ring-green-100 dark:ring-green-900/40';
            case 'gray':
                return 'bg-gray-50 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400 ring-1 ring-gray-100 dark:ring-gray-800';
            default:
                return '';
        }
    };

    return (
        <Badge
            variant="outline"
            className={`w-fit rounded-full px-2.5 py-0.5 text-[8px] font-black tracking-widest uppercase sm:px-3 sm:py-1 sm:text-[10px] ${getStatusColor(status.color)} ${className}`}
        >
            {status.label}
        </Badge>
    );
}

interface PriorityBadgeProps {
    priority: {
        label: string;
        color: string;
    };
    className?: string;
}

export function TicketPriorityBadge({
    priority,
    className,
}: PriorityBadgeProps) {
    const getPriorityColor = (color: string) => {
        switch (color) {
            case 'red':
                return 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 ring-1 ring-red-100 dark:ring-red-900/40';
            case 'orange':
                return 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400 ring-1 ring-orange-100 dark:ring-orange-900/40';
            case 'blue':
                return 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 ring-1 ring-blue-100 dark:ring-blue-900/40';
            case 'gray':
                return 'bg-gray-50 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400 ring-1 ring-gray-100 dark:ring-gray-800';
            default:
                return '';
        }
    };

    return (
        <Badge
            variant="outline"
            className={`w-fit rounded-full px-2.5 py-0.5 text-[8px] font-black tracking-widest uppercase sm:px-3 sm:py-1 sm:text-[10px] ${getPriorityColor(priority.color)} ${className}`}
        >
            {priority.label}
        </Badge>
    );
}
