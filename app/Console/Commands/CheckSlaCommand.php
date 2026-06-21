<?php

namespace App\Console\Commands;

use App\Enums\TicketPriority;
use App\Enums\TicketStatus;
use App\Models\Ticket;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

#[Signature('sla:check')]
#[Description('Check tickets for SLA breach and escalate them')]
class CheckSlaCommand extends Command
{
    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $breachedTickets = Ticket::where('sla_breached', false)
            ->whereNull('resolved_at')
            ->whereNull('closed_at')
            ->whereNotIn('status', [TicketStatus::Resolved, TicketStatus::Closed])
            ->where('sla_due_at', '<', now())
            ->get();

        if ($breachedTickets->isEmpty()) {
            $this->info('No tickets have breached SLA.');

            return 0;
        }

        foreach ($breachedTickets as $ticket) {
            $ticket->sla_breached = true;
            $ticket->escalated_count += 1;

            $oldPriority = $ticket->priority;

            // Escalate priority
            if ($ticket->priority === TicketPriority::Low) {
                $ticket->priority = TicketPriority::Medium;
            } elseif ($ticket->priority === TicketPriority::Medium) {
                $ticket->priority = TicketPriority::High;
            } elseif ($ticket->priority === TicketPriority::High) {
                $ticket->priority = TicketPriority::Urgent;
            }

            // Recalculate SLA with the new priority from the creation time
            $ticket->sla_due_at = ($ticket->created_at ?: now())->addHours($ticket->priority->slaDurationHours());

            Log::warning("SLA breached for Ticket #{$ticket->ticket_number}. Escalated priority from {$oldPriority->value} to {$ticket->priority->value}.");

            $ticket->save();
        }

        $this->info("Successfully processed {$breachedTickets->count()} breached tickets.");

        return 0;
    }
}
