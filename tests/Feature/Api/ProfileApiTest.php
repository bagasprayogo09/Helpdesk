<?php

namespace Tests\Feature\Api;

use App\Models\User;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class ProfileApiTest extends TestCase
{
    use LazilyRefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create([
            'password' => bcrypt('password'),
        ]);
    }

    public function test_can_show_profile_via_api(): void
    {
        $response = $this->actingAs($this->user)->getJson(route('api.profile.show'));

        $response->assertStatus(200);
        $response->assertJsonPath('user.email', $this->user->email);
    }

    public function test_can_update_profile_via_api(): void
    {
        $response = $this->actingAs($this->user)->patchJson(route('api.profile.update'), [
            'name' => 'Updated Name API',
            'email' => 'updatedapi@example.com',
        ]);

        $response->assertStatus(200);
        $response->assertJsonPath('user.name', 'Updated Name API');
        $this->assertDatabaseHas('users', [
            'id' => $this->user->id,
            'name' => 'Updated Name API',
            'email' => 'updatedapi@example.com',
        ]);
    }

    public function test_can_delete_profile_via_api(): void
    {
        $response = $this->actingAs($this->user)->deleteJson(route('api.profile.destroy'), [
            'password' => 'password',
        ]);

        $response->assertStatus(200);
        $response->assertJsonPath('success', true);
        $this->assertGuest();
        $this->assertModelMissing($this->user);
    }

    public function test_can_update_password_via_api(): void
    {
        $response = $this->actingAs($this->user)->putJson(route('api.user-password.update'), [
            'current_password' => 'password',
            'password' => 'NewPassword123!',
            'password_confirmation' => 'NewPassword123!',
        ]);

        $response->assertStatus(200);
        $response->assertJsonPath('success', true);
        $this->assertTrue(Hash::check('NewPassword123!', $this->user->fresh()->password));
    }
}
