<?php

namespace App\Http\Requests\Ticket;

use App\Enums\TicketPriority;
use App\Enums\TicketStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTicketRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'divisi_id' => ['sometimes', 'required', 'exists:divisis,id'],
            'issue_category_id' => ['sometimes', 'required', 'exists:issue_categories,id'],
            'assigned_to' => ['nullable', 'exists:users,id'],
            'subject' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['sometimes', 'required', 'string'],
            'status' => [
                'sometimes',
                'required',
                Rule::enum(TicketStatus::class),
                function ($attribute, $value, $fail) {
                    $ticket = $this->route('ticket');
                    if ($ticket) {
                        $targetStatus = TicketStatus::tryFrom($value);
                        if ($targetStatus && ! $ticket->status->canTransitionTo($targetStatus)) {
                            $fail("Status tidak dapat diubah dari {$ticket->status->label()} ke {$targetStatus->label()}.");
                        }
                    }
                },
            ],
            'priority' => ['sometimes', 'required', Rule::enum(TicketPriority::class)],
        ];
    }
}
