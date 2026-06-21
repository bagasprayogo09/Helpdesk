<?php

namespace Tests\Feature\Api;

use App\Models\Divisi;
use App\Models\User;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Tests\TestCase;

class DivisiApiTest extends TestCase
{
    use LazilyRefreshDatabase;

    protected User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->admin()->create();
    }

    public function test_can_list_divisis_via_api(): void
    {
        Divisi::factory()->count(3)->create();

        $response = $this->actingAs($this->admin)->getJson(route('api.divisi.index'));

        $response->assertStatus(200);
        $response->assertJsonCount(3, 'data');
    }

    public function test_can_create_divisi_via_api(): void
    {
        $response = $this->actingAs($this->admin)->postJson(route('api.divisi.store'), [
            'name' => 'IT Support API',
            'description' => 'Information Technology Support Division via API',
        ]);

        $response->assertStatus(201);
        $response->assertJsonPath('data.name', 'IT Support API');
        $this->assertDatabaseHas('divisis', [
            'name' => 'IT Support API',
        ]);
    }

    public function test_can_update_divisi_via_api(): void
    {
        $divisi = Divisi::factory()->create(['name' => 'Old Name API']);

        $response = $this->actingAs($this->admin)->putJson(route('api.divisi.update', $divisi), [
            'name' => 'New Name API',
            'description' => 'Updated Description via API',
        ]);

        $response->assertStatus(200);
        $response->assertJsonPath('data.name', 'New Name API');
        $this->assertDatabaseHas('divisis', [
            'id' => $divisi->id,
            'name' => 'New Name API',
        ]);
    }

    public function test_can_delete_divisi_via_api(): void
    {
        $divisi = Divisi::factory()->create();

        $response = $this->actingAs($this->admin)->deleteJson(route('api.divisi.destroy', $divisi));

        $response->assertStatus(200);
        $this->assertModelMissing($divisi);
    }
}
