<?php

namespace Tests\Feature;

use App\Enums\TicketPriority;
use App\Enums\TicketStatus;
use App\Models\Divisi;
use App\Models\IssueCategory;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Tests\TestCase;

class TicketTest extends TestCase
{
    use LazilyRefreshDatabase;

    protected User $user;

    protected Divisi $divisi;

    protected IssueCategory $category;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->admin()->create();
        $this->divisi = Divisi::factory()->create();
        $this->category = IssueCategory::factory()->create([
            'divisi_id' => $this->divisi->id,
        ]);
    }

    public function test_can_transition_from_open_to_in_progress(): void
    {
        $ticket = Ticket::factory()->create([
            'user_id' => $this->user->id,
            'divisi_id' => $this->divisi->id,
            'issue_category_id' => $this->category->id,
            'status' => TicketStatus::Open,
        ]);

        $response = $this->actingAs($this->user)->putJson(route('api.tickets.update', $ticket), [
            'status' => TicketStatus::InProgress->value,
        ]);

        $response->assertStatus(200);
        $this->assertEquals(TicketStatus::InProgress, $ticket->refresh()->status);
    }

    public function test_cannot_transition_from_open_to_resolved_directly(): void
    {
        $ticket = Ticket::factory()->create([
            'user_id' => $this->user->id,
            'divisi_id' => $this->divisi->id,
            'issue_category_id' => $this->category->id,
            'status' => TicketStatus::Open,
        ]);

        $response = $this->actingAs($this->user)->putJson(route('api.tickets.update', $ticket), [
            'status' => TicketStatus::Resolved->value,
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors('status');
        $this->assertEquals(TicketStatus::Open, $ticket->refresh()->status);
    }

    public function test_model_level_guards_against_invalid_transitions(): void
    {
        $ticket = Ticket::factory()->create([
            'user_id' => $this->user->id,
            'divisi_id' => $this->divisi->id,
            'issue_category_id' => $this->category->id,
            'status' => TicketStatus::Open,
        ]);

        $this->expectException(\DomainException::class);

        $ticket->status = TicketStatus::Resolved;
        $ticket->save();
    }

    public function test_ticket_sets_sla_due_at_automatically_on_creation(): void
    {
        $ticket = Ticket::factory()->create([
            'user_id' => $this->user->id,
            'divisi_id' => $this->divisi->id,
            'issue_category_id' => $this->category->id,
            'priority' => TicketPriority::High,
        ]);

        $this->assertNotNull($ticket->sla_due_at);
        // High priority has an 8 hours SLA limit
        $expectedDue = $ticket->created_at->addHours(8);
        $this->assertTrue($ticket->sla_due_at->equalTo($expectedDue));
    }

    public function test_ticket_recalculates_sla_due_at_on_priority_change(): void
    {
        $ticket = Ticket::factory()->create([
            'user_id' => $this->user->id,
            'divisi_id' => $this->divisi->id,
            'issue_category_id' => $this->category->id,
            'priority' => TicketPriority::Medium,
        ]);

        // Recalculate to Urgent (2 hours SLA limit)
        $ticket->priority = TicketPriority::Urgent;
        $ticket->save();

        $expectedDue = $ticket->created_at->addHours(2);
        $this->assertTrue($ticket->refresh()->sla_due_at->equalTo($expectedDue));
    }

    public function test_sla_check_command_escalates_breached_tickets(): void
    {
        $ticket = Ticket::factory()->create([
            'user_id' => $this->user->id,
            'divisi_id' => $this->divisi->id,
            'issue_category_id' => $this->category->id,
            'status' => TicketStatus::Open,
            'priority' => TicketPriority::Medium,
            'sla_due_at' => now()->subMinutes(10), // already breached 10 mins ago
            'sla_breached' => false,
        ]);

        $this->artisan('sla:check')
            ->expectsOutput('Successfully processed 1 breached tickets.')
            ->assertExitCode(0);

        $ticket->refresh();
        $this->assertTrue($ticket->sla_breached);
        $this->assertEquals(1, $ticket->escalated_count);
        // Medium escalated to High (8 hours SLA limit)
        $this->assertEquals(TicketPriority::High, $ticket->priority);
        $expectedDue = $ticket->created_at->addHours(8);
        $this->assertTrue($ticket->sla_due_at->equalTo($expectedDue));
    }
}
