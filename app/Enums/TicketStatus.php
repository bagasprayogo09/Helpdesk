<?php

namespace App\Enums;

enum TicketStatus: string
{
    case Open = 'open';
    case Pending = 'pending';
    case InProgress = 'in_progress';
    case Resolved = 'resolved';
    case Closed = 'closed';

    public function label(): string
    {
        return match ($this) {
            self::Open => 'Terbuka',
            self::Pending => 'Menunggu',
            self::InProgress => 'Sedang Dikerjakan',
            self::Resolved => 'Selesai',
            self::Closed => 'Ditutup',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::Open => 'blue',
            self::Pending => 'yellow',
            self::InProgress => 'orange',
            self::Resolved => 'green',
            self::Closed => 'gray',
        };
    }

    /**
     * Get the allowed target statuses from the current status.
     *
     * @return array<TicketStatus>
     */
    public function allowedTransitions(): array
    {
        return match ($this) {
            self::Open => [self::InProgress, self::Pending, self::Closed],
            self::Pending => [self::InProgress, self::Closed],
            self::InProgress => [self::Pending, self::Resolved, self::Open],
            self::Resolved => [self::Closed, self::InProgress],
            self::Closed => [self::InProgress], // Can be reopened
        };
    }

    /**
     * Check if transition to target status is allowed.
     */
    public function canTransitionTo(self $target): bool
    {
        if ($this === $target) {
            return true;
        }

        return in_array($target, $this->allowedTransitions(), true);
    }
}
