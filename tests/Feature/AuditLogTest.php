<?php

namespace Tests\Feature;

use App\Models\AuditLog;
use App\Models\Divisi;
use App\Models\User;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Tests\TestCase;

class AuditLogTest extends TestCase
{
    use LazilyRefreshDatabase;

    protected User $admin;

    protected User $regularUser;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->admin()->create();
        $this->regularUser = User::factory()->create();
    }

    public function test_creating_divisi_logs_activity(): void
    {
        $this->actingAs($this->admin);

        $divisi = Divisi::create([
            'name' => 'HRD',
            'description' => 'Human Resources Department',
        ]);

        $this->assertDatabaseHas('audit_logs', [
            'event' => 'created',
            'auditable_type' => Divisi::class,
            'auditable_id' => $divisi->id,
            'user_id' => $this->admin->id,
        ]);
    }

    public function test_updating_divisi_logs_changes(): void
    {
        $divisi = Divisi::create([
            'name' => 'HRD',
            'description' => 'Human Resources Department',
        ]);

        $this->actingAs($this->admin);

        $divisi->update([
            'name' => 'Human Resources',
        ]);

        $this->assertDatabaseHas('audit_logs', [
            'event' => 'updated',
            'auditable_type' => Divisi::class,
            'auditable_id' => $divisi->id,
            'user_id' => $this->admin->id,
        ]);

        $log = AuditLog::where('event', 'updated')
            ->where('auditable_type', Divisi::class)
            ->where('auditable_id', $divisi->id)
            ->first();

        $this->assertNotNull($log);
        $this->assertEquals('HRD', $log->old_values['name']);
        $this->assertEquals('Human Resources', $log->new_values['name']);
    }

    public function test_admin_can_access_audit_logs_page(): void
    {
        $response = $this->actingAs($this->admin)->get(route('audit-logs.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('audit-logs/index')
            ->has('logs')
        );
    }

    public function test_regular_user_cannot_access_audit_logs_page(): void
    {
        $response = $this->actingAs($this->regularUser)->get(route('audit-logs.index'));

        $response->assertStatus(403);
    }
}
