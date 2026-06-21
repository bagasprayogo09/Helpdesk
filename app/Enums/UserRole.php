<?php

namespace App\Enums;

enum UserRole: string
{
    case Admin = 'admin';
    case Supervisor = 'supervisor';
    case Approver = 'approver';
    case Petugas = 'petugas';
    case User = 'user';

    /**
     * Get the label for the role.
     */
    public function label(): string
    {
        return match ($this) {
            self::Admin => 'Administrator',
            self::Supervisor => 'Supervisor',
            self::Approver => 'Approver',
            self::Petugas => 'Petugas',
            self::User => 'User',
        };
    }
}
