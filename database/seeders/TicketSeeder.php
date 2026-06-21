<?php

namespace Database\Seeders;

use App\Models\IssueCategory;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Database\Seeder;

class TicketSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::where('role', 'user')->get();
        $petugas = User::where('role', 'petugas')->get();
        $categories = IssueCategory::with('divisi')->get();

        if ($users->isEmpty() || $petugas->isEmpty() || $categories->isEmpty()) {
            return;
        }

        // Create 200 tickets
        Ticket::factory(200)->make()->each(function ($ticket) use ($users, $petugas, $categories) {
            $category = $categories->random();
            $ticket->divisi_id = $category->divisi_id;
            $ticket->issue_category_id = $category->id;
            $ticket->user_id = $users->random()->id;

            // 70% chance to be assigned to a petugas
            if (fake()->boolean(70)) {
                $ticket->assigned_to = $petugas->random()->id;
            }

            $ticket->save();
        });
    }
}
