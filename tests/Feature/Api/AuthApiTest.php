<?php

namespace Tests\Feature\Api;

use App\Models\User;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Tests\TestCase;

class AuthApiTest extends TestCase
{
    use LazilyRefreshDatabase;

    public function test_can_register_via_api(): void
    {
        $response = $this->postJson(route('api.register'), [
            'name' => 'John Doe API',
            'email' => 'johndoeapi@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
        ]);

        $response->assertStatus(201);
        $response->assertJsonPath('success', true);
        $response->assertJsonPath('user.email', 'johndoeapi@example.com');
        $this->assertAuthenticated();
    }

    public function test_can_login_via_api(): void
    {
        $user = User::factory()->create([
            'email' => 'loginapi@example.com',
            'password' => bcrypt('Password123!'),
        ]);

        $response = $this->postJson(route('api.login'), [
            'email' => 'loginapi@example.com',
            'password' => 'Password123!',
        ]);

        $response->assertStatus(200);
        $response->assertJsonPath('success', true);
        $response->assertJsonPath('user.email', 'loginapi@example.com');
        $this->assertAuthenticatedAs($user);
    }

    public function test_can_logout_via_api(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson(route('api.logout'));

        $response->assertStatus(200);
        $response->assertJsonPath('success', true);
        $this->assertGuest();
    }
}
