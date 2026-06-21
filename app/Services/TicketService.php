<?php

namespace App\Services;

use App\Enums\TicketPriority;
use App\Enums\TicketStatus;
use App\Models\Divisi;
use App\Models\IssueCategory;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class TicketService
{
    /**
     * Get tickets based on user role.
     */
    public function getTicketsForUser(User $user): LengthAwarePaginator
    {
        $query = Ticket::with(['user', 'divisi', 'issueCategory', 'assignedTo']);

        if ($user->isPetugas()) {
            $query->where('assigned_to', $user->id);
        } elseif (! $user->isAdmin() && ! $user->isSupervisor() && ! $user->isApprover()) {
            $query->where('user_id', $user->id);
        }

        return $query->latest()->paginate(10);
    }

    /**
     * Create a new ticket.
     */
    public function createTicket(User $user, array $data): Ticket
    {
        return $user->tickets()->create($data);
    }

    /**
     * Update an existing ticket.
     */
    public function updateTicket(Ticket $ticket, array $data): Ticket
    {
        $ticket->update($data);

        if ($ticket->status === TicketStatus::InProgress && ! $ticket->in_progress_at) {
            $ticket->update(['in_progress_at' => now()]);
        }

        if ($ticket->status === TicketStatus::Resolved && ! $ticket->resolved_at) {
            $ticket->update(['resolved_at' => now()]);
        }

        if ($ticket->status === TicketStatus::Closed && ! $ticket->closed_at) {
            $ticket->update(['closed_at' => now()]);
        }

        return $ticket;
    }

    /**
     * Delete a ticket.
     */
    public function deleteTicket(Ticket $ticket): bool
    {
        return $ticket->delete();
    }

    /**
     * Get ticket details with relations.
     */
    public function getTicketDetails(Ticket $ticket): Ticket
    {
        return $ticket->load(['user', 'divisi', 'issueCategory', 'assignedTo']);
    }

    /**
     * Get data needed for creating a ticket.
     */
    public function getCreateData(): array
    {
        return [
            'divisis' => Divisi::all(),
            'issue_categories' => IssueCategory::all(),
        ];
    }

    /**
     * Get data needed for editing a ticket.
     */
    public function getEditData(Ticket $ticket): array
    {
        return [
            'ticket' => $this->getTicketDetails($ticket),
            'divisis' => Divisi::all(),
            'issue_categories' => IssueCategory::all(),
            'agents' => User::whereIn('role', ['admin', 'supervisor', 'approver', 'petugas'])->get(['id', 'name']),
        ];
    }

    /**
     * Get statistics for the dashboard.
     */
    public function getDashboardStats(User $user): array
    {
        $query = Ticket::query();

        // Jika bukan admin/supervisor, batasi data (opsional, tergantung kebijakan dashboard)
        if (! $user->isAdmin() && ! $user->isSupervisor()) {
            $query->where('user_id', $user->id);
        }

        $totalTickets = (clone $query)->count();
        $statusCounts = (clone $query)
            ->selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->get()
            ->mapWithKeys(fn ($item) => [
                ($item->status instanceof \UnitEnum ? $item->status->value : $item->status) => $item->count,
            ])
            ->toArray();

        $priorityCounts = (clone $query)
            ->selectRaw('priority, count(*) as count')
            ->groupBy('priority')
            ->get()
            ->mapWithKeys(fn ($item) => [
                ($item->priority instanceof \UnitEnum ? $item->priority->value : $item->priority) => $item->count,
            ])
            ->toArray();

        $unassignedCount = (clone $query)
            ->whereNull('assigned_to')
            ->whereNotIn('status', [TicketStatus::Resolved->value, TicketStatus::Closed->value])
            ->count();

        // Format data untuk frontend
        return [
            'total' => $totalTickets,
            'unassigned' => $unassignedCount,
            'by_status' => collect(TicketStatus::cases())->map(fn ($status) => [
                'value' => $status->value,
                'label' => $status->label(),
                'color' => $status->color(),
                'count' => $statusCounts[$status->value] ?? 0,
            ]),
            'by_priority' => collect(TicketPriority::cases())->map(fn ($priority) => [
                'value' => $priority->value,
                'label' => $priority->label(),
                'color' => $priority->color(),
                'count' => $priorityCounts[$priority->value] ?? 0,
            ]),
            'recent_tickets' => (clone $query)->with(['user', 'divisi'])
                ->latest()
                ->limit(5)
                ->get()
                ->map(fn ($ticket) => [
                    'id' => $ticket->id,
                    'ticket_number' => $ticket->ticket_number,
                    'subject' => $ticket->subject,
                    'user_name' => $ticket->user->name,
                    'divisi_name' => $ticket->divisi->name,
                    'status_label' => $ticket->status->label(),
                    'status_color' => $ticket->status->color(),
                    'created_at' => $ticket->created_at->diffForHumans(),
                ]),
            'calendar_events' => $this->getCalendarEvents($user),
        ];
    }

    /**
     * Get events for the dashboard calendar.
     */
    public function getCalendarEvents(User $user): array
    {
        $query = Ticket::query()
            ->where(function ($q) {
                $q->where('created_at', '>=', now()->subMonths(3))
                    ->orWhere('in_progress_at', '>=', now()->subMonths(3))
                    ->orWhere('closed_at', '>=', now()->subMonths(3));
            });

        if (! $user->isAdmin() && ! $user->isSupervisor()) {
            $query->where('user_id', $user->id);
        }

        $tickets = $query->get(['id', 'ticket_number', 'subject', 'status', 'created_at', 'in_progress_at', 'closed_at']);

        $events = [];

        foreach ($tickets as $ticket) {
            // Event: Dibuat
            $events[] = [
                'id' => "{$ticket->id}-created",
                'ticket_id' => $ticket->id,
                'title' => "Dibuat: {$ticket->ticket_number}",
                'description' => $ticket->subject,
                'date' => $ticket->created_at->toDateString(),
                'type' => 'created',
                'color' => 'blue',
            ];

            // Event: Diproses
            if ($ticket->in_progress_at) {
                $events[] = [
                    'id' => "{$ticket->id}-progress",
                    'ticket_id' => $ticket->id,
                    'title' => "Diproses: {$ticket->ticket_number}",
                    'description' => $ticket->subject,
                    'date' => $ticket->in_progress_at->toDateString(),
                    'type' => 'in_progress',
                    'color' => 'orange',
                ];
            }

            // Event: Ditutup
            if ($ticket->closed_at) {
                $events[] = [
                    'id' => "{$ticket->id}-closed",
                    'ticket_id' => $ticket->id,
                    'title' => "Ditutup: {$ticket->ticket_number}",
                    'description' => $ticket->subject,
                    'date' => $ticket->closed_at->toDateString(),
                    'type' => 'closed',
                    'color' => 'gray',
                ];
            }
        }

        return $events;
    }
}
