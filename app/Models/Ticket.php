<?php

namespace App\Models;

use App\Concerns\LogsActivity;
use App\Enums\TicketPriority;
use App\Enums\TicketStatus;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

#[Fillable([
    'ticket_number',
    'user_id',
    'divisi_id',
    'issue_category_id',
    'assigned_to',
    'subject',
    'description',
    'status',
    'priority',
    'in_progress_at',
    'resolved_at',
    'closed_at',
    'sla_due_at',
    'sla_breached',
    'escalated_count',
])]
class Ticket extends Model
{
    use HasFactory, LogsActivity;

    protected function casts(): array
    {
        return [
            'status' => TicketStatus::class,
            'priority' => TicketPriority::class,
            'in_progress_at' => 'datetime',
            'resolved_at' => 'datetime',
            'closed_at' => 'datetime',
            'sla_due_at' => 'datetime',
            'sla_breached' => 'boolean',
        ];
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($ticket) {
            if (! $ticket->ticket_number) {
                $ticket->ticket_number = 'TKT-'.strtoupper(Str::random(8));
            }
            if (! $ticket->sla_due_at) {
                $priority = $ticket->priority ?: TicketPriority::Medium;
                $ticket->sla_due_at = now()->addHours($priority->slaDurationHours());
            }
        });

        static::updating(function ($ticket) {
            if ($ticket->isDirty('priority')) {
                $ticket->sla_due_at = ($ticket->created_at ?: now())->addHours($ticket->priority->slaDurationHours());
            }

            if ($ticket->isDirty('status')) {
                $originalRaw = $ticket->getOriginal('status');
                $originalStatus = $originalRaw instanceof TicketStatus
                    ? $originalRaw
                    : TicketStatus::tryFrom($originalRaw);

                $newStatus = $ticket->status;

                if ($originalStatus && ! $originalStatus->canTransitionTo($newStatus)) {
                    throw new \DomainException("Invalid status transition from {$originalStatus->value} to {$newStatus->value}.");
                }
            }
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function divisi(): BelongsTo
    {
        return $this->belongsTo(Divisi::class);
    }

    public function issueCategory(): BelongsTo
    {
        return $this->belongsTo(IssueCategory::class);
    }

    public function assignedTo(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }
}
