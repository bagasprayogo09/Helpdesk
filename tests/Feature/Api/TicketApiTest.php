<?php

namespace Tests\Feature\Api;

use App\Enums\TicketPriority;
use App\Enums\TicketStatus;
use App\Models\Divisi;
use App\Models\IssueCategory;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Tests\TestCase;

class TicketApiTest extends TestCase
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

    public function test_can_list_tickets_via_api(): void
    {
        Ticket::factory()->count(2)->create([
            'user_id' => $this->user->id,
            'divisi_id' => $this->divisi->id,
            'issue_category_id' => $this->category->id,
        ]);

        $response = $this->actingAs($this->user)->getJson(route('api.tickets.index'));

        $response->assertStatus(200);
        $response->assertJsonCount(2, 'data');
    }

    public function test_can_create_ticket_via_api(): void
    {
        $response = $this->actingAs($this->user)->postJson(route('api.tickets.store'), [
            'divisi_id' => $this->divisi->id,
            'issue_category_id' => $this->category->id,
            'subject' => 'Printer Error API',
            'description' => 'Cannot print color documents',
            'priority' => TicketPriority::Medium->value,
        ]);

        $response->assertStatus(201);
        $response->assertJsonPath('data.subject', 'Printer Error API');
        $this->assertDatabaseHas('tickets', [
            'subject' => 'Printer Error API',
            'user_id' => $this->user->id,
        ]);
    }

    public function test_can_show_ticket_via_api(): void
    {
        $ticket = Ticket::factory()->create([
            'user_id' => $this->user->id,
            'divisi_id' => $this->divisi->id,
            'issue_category_id' => $this->category->id,
        ]);

        $response = $this->actingAs($this->user)->getJson(route('api.tickets.show', $ticket));

        $response->assertStatus(200);
        $response->assertJsonPath('data.id', $ticket->id);
    }

    public function test_can_update_ticket_via_api(): void
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
        $response->assertJsonPath('data.status.value', TicketStatus::InProgress->value);
        $this->assertEquals(TicketStatus::InProgress, $ticket->refresh()->status);
    }

    public function test_can_delete_ticket_via_api(): void
    {
        $ticket = Ticket::factory()->create([
            'user_id' => $this->user->id,
            'divisi_id' => $this->divisi->id,
            'issue_category_id' => $this->category->id,
        ]);

        $response = $this->actingAs($this->user)->deleteJson(route('api.tickets.destroy', $ticket));

        $response->assertStatus(200);
        $this->assertModelMissing($ticket);
    }
}
