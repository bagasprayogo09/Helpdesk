<?php

namespace App\Concerns;

use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

trait LogsActivity
{
    protected static function bootLogsActivity(): void
    {
        static::created(function (Model $model) {
            static::logActivity($model, 'created');
        });

        static::updated(function (Model $model) {
            $changes = $model->getChanges();
            if (empty($changes)) {
                return;
            }

            unset($changes['updated_at']);
            if (empty($changes)) {
                return;
            }

            $oldValues = [];
            $newValues = [];

            foreach ($changes as $key => $newValue) {
                $oldValues[$key] = $model->getOriginal($key);
                $newValues[$key] = $newValue;
            }

            static::logActivity($model, 'updated', $oldValues, $newValues);
        });

        static::deleted(function (Model $model) {
            static::logActivity($model, 'deleted', $model->toArray());
        });
    }

    protected static function logActivity(Model $model, string $event, ?array $oldValues = null, ?array $newValues = null): void
    {
        $description = static::generateActivityDescription($model, $event, $oldValues, $newValues);

        AuditLog::create([
            'user_id' => Auth::id(),
            'event' => $event,
            'auditable_type' => get_class($model),
            'auditable_id' => $model->getKey(),
            'old_values' => $oldValues,
            'new_values' => $newValues,
            'description' => $description,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }

    protected static function generateActivityDescription(Model $model, string $event, ?array $oldValues = null, ?array $newValues = null): string
    {
        $userName = Auth::user()?->name ?? 'Sistem';
        $modelName = class_basename($model);

        if ($modelName === 'Ticket') {
            $ticketNumber = $model->ticket_number;
            switch ($event) {
                case 'created':
                    return "{$userName} membuat tiket {$ticketNumber}";
                case 'updated':
                    $descParts = [];
                    if (isset($newValues['status'])) {
                        $oldVal = $oldValues['status'];
                        $newVal = $newValues['status'];
                        $oldLabel = $oldVal instanceof \UnitEnum ? $oldVal->value : $oldVal;
                        $newLabel = $newVal instanceof \UnitEnum ? $newVal->value : $newVal;
                        $descParts[] = "mengubah status dari '{$oldLabel}' ke '{$newLabel}'";
                    }
                    if (isset($newValues['assigned_to'])) {
                        $agentId = $newValues['assigned_to'];
                        $agent = User::find($agentId);
                        $agentName = $agent ? $agent->name : 'agen lain';
                        $descParts[] = "menugaskan tiket ke {$agentName}";
                    }
                    if (isset($newValues['priority'])) {
                        $oldVal = $oldValues['priority'];
                        $newVal = $newValues['priority'];
                        $oldLabel = $oldVal instanceof \UnitEnum ? $oldVal->value : $oldVal;
                        $newLabel = $newVal instanceof \UnitEnum ? $newVal->value : $newVal;
                        $descParts[] = "mengubah prioritas dari '{$oldLabel}' ke '{$newLabel}'";
                    }
                    if (empty($descParts)) {
                        return "{$userName} memperbarui detail tiket {$ticketNumber}";
                    }

                    return "{$userName} ".implode(' dan ', $descParts)." pada tiket {$ticketNumber}";
                case 'deleted':
                    return "{$userName} menghapus tiket {$ticketNumber}";
            }
        }

        switch ($event) {
            case 'created':
                return "{$userName} membuat {$modelName} baru";
            case 'updated':
                return "{$userName} memperbarui {$modelName}";
            case 'deleted':
                return "{$userName} menghapus {$modelName}";
            default:
                return "{$userName} melakukan aksi {$event} pada {$modelName}";
        }
    }
}
