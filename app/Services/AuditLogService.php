<?php

namespace App\Services;

use App\Models\AuditLog;
use App\Models\Divisi;
use App\Models\IssueCategory;
use App\Models\Ticket;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class AuditLogService
{
    public function getPaginatedLogs(array $filters): LengthAwarePaginator
    {
        $query = AuditLog::with('user')->latest();

        if (! empty($filters['search'])) {
            $query->where(
                'description',
                'like',
                '%'.$filters['search'].'%'
            );
        }

        if (! empty($filters['event'])) {
            $query->where('event', $filters['event']);
        }

        if (! empty($filters['type'])) {
            match ($filters['type']) {
                'ticket' => $query->where('auditable_type', Ticket::class),
                'divisi' => $query->where('auditable_type', Divisi::class),
                'category' => $query->where('auditable_type', IssueCategory::class),
                default => null,
            };
        }

        return $query->paginate(15)
            ->withQueryString()
            ->through(fn ($log) => [
                'id' => $log->id,
                'user_id' => $log->user_id,
                'user_name' => $log->user?->name ?? 'Sistem',
                'event' => $log->event,
                'auditable_type' => class_basename($log->auditable_type),
                'auditable_id' => $log->auditable_id,
                'old_values' => $log->old_values,
                'new_values' => $log->new_values,
                'description' => $log->description,
                'ip_address' => $log->ip_address,
                'user_agent' => $log->user_agent,
                'created_at' => $log->created_at->isoFormat('D MMMM YYYY, HH:mm'),
                'created_at_human' => $log->created_at->diffForHumans(),
            ]);
    }
}
