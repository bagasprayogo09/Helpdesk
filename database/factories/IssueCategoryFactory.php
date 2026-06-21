<?php

namespace Database\Factories;

use App\Models\Divisi;
use App\Models\IssueCategory;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<IssueCategory>
 */
class IssueCategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'divisi_id' => Divisi::factory(),
            'name' => $this->faker->unique()->words(3, true),
            'description' => $this->faker->sentence(),
        ];
    }
}
