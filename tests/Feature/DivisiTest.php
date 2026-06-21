<?php

namespace Tests\Feature;

use App\Models\Divisi;
use App\Models\User;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Tests\TestCase;

class DivisiTest extends TestCase
{
    use LazilyRefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->admin()->create();
    }

    public function test_can_list_divisis(): void
    {
        Divisi::factory()->count(3)->create();

        $response = $this->actingAs($this->user)->getJson(route('api.divisi.index'));

        $response->assertStatus(200);
        $response->assertJsonCount(3, 'data');
    }

    public function test_can_create_divisi(): void
    {
        $response = $this->actingAs($this->user)->postJson(route('api.divisi.store'), [
            'name' => 'IT Support',
            'description' => 'Information Technology Support Division',
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('divisis', [
            'name' => 'IT Support',
            'description' => 'Information Technology Support Division',
        ]);
    }

    public function test_can_update_divisi(): void
    {
        $divisi = Divisi::factory()->create([
            'name' => 'Old Name',
        ]);

        $response = $this->actingAs($this->user)->putJson(route('api.divisi.update', $divisi), [
            'name' => 'New Name',
            'description' => 'Updated Description',
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('divisis', [
            'id' => $divisi->id,
            'name' => 'New Name',
            'description' => 'Updated Description',
        ]);
    }

    public function test_can_delete_divisi(): void
    {
        $divisi = Divisi::factory()->create();

        $response = $this->actingAs($this->user)->deleteJson(route('api.divisi.destroy', $divisi));

        $response->assertStatus(200);
        $this->assertModelMissing($divisi);
    }

    public function test_name_is_required_for_creating(): void
    {
        $response = $this->actingAs($this->user)->postJson(route('api.divisi.store'), [
            'name' => '',
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors('name');
    }

    public function test_name_must_be_unique_for_creating(): void
    {
        Divisi::factory()->create(['name' => 'Existing']);

        $response = $this->actingAs($this->user)->postJson(route('api.divisi.store'), [
            'name' => 'Existing',
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors('name');
    }
}
