<?php

namespace Tests\Feature\Api;

use App\Models\Divisi;
use App\Models\IssueCategory;
use App\Models\User;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Tests\TestCase;

class IssueCategoryApiTest extends TestCase
{
    use LazilyRefreshDatabase;

    protected User $admin;

    protected Divisi $divisi;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->admin()->create();
        $this->divisi = Divisi::factory()->create();
    }

    public function test_can_list_issue_categories_via_api(): void
    {
        IssueCategory::factory()->count(3)->create(['divisi_id' => $this->divisi->id]);

        $response = $this->actingAs($this->admin)->getJson(route('api.issue-categories.index'));

        $response->assertStatus(200);
        $response->assertJsonCount(3, 'data');
    }

    public function test_can_create_issue_category_via_api(): void
    {
        $response = $this->actingAs($this->admin)->postJson(route('api.issue-categories.store'), [
            'name' => 'Network Issue API',
            'description' => 'Issues related to network connectivity',
            'divisi_id' => $this->divisi->id,
        ]);

        $response->assertStatus(201);
        $response->assertJsonPath('data.name', 'Network Issue API');
        $this->assertDatabaseHas('issue_categories', [
            'name' => 'Network Issue API',
            'divisi_id' => $this->divisi->id,
        ]);
    }

    public function test_can_update_issue_category_via_api(): void
    {
        $category = IssueCategory::factory()->create([
            'name' => 'Old Category API',
            'divisi_id' => $this->divisi->id,
        ]);

        $response = $this->actingAs($this->admin)->putJson(route('api.issue-categories.update', $category), [
            'name' => 'New Category API',
            'description' => 'Updated description',
            'divisi_id' => $this->divisi->id,
        ]);

        $response->assertStatus(200);
        $response->assertJsonPath('data.name', 'New Category API');
        $this->assertDatabaseHas('issue_categories', [
            'id' => $category->id,
            'name' => 'New Category API',
        ]);
    }

    public function test_can_delete_issue_category_via_api(): void
    {
        $category = IssueCategory::factory()->create(['divisi_id' => $this->divisi->id]);

        $response = $this->actingAs($this->admin)->deleteJson(route('api.issue-categories.destroy', $category));

        $response->assertStatus(200);
        $this->assertModelMissing($category);
    }
}
