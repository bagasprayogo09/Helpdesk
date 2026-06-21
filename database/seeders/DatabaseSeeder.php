<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\Divisi;
use App\Models\IssueCategory;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create Admin User
        User::updateOrCreate(
            ['email' => 'admin@admin.com'],
            [
                'name' => 'Administrator',
                'password' => Hash::make('password'),
                'role' => UserRole::Admin,
            ]
        );

        // Create Supervisor
        User::updateOrCreate(
            ['email' => 'supervisor@admin.com'],
            [
                'name' => 'Supervisor User',
                'password' => Hash::make('password'),
                'role' => UserRole::Supervisor,
            ]
        );

        // Create Approver
        User::updateOrCreate(
            ['email' => 'approver@admin.com'],
            [
                'name' => 'Approver User',
                'password' => Hash::make('password'),
                'role' => UserRole::Approver,
            ]
        );

        // Create Petugas
        User::updateOrCreate(
            ['email' => 'petugas@admin.com'],
            [
                'name' => 'Petugas User',
                'password' => Hash::make('password'),
                'role' => UserRole::Petugas,
            ]
        );

        // Create Regular User
        User::updateOrCreate(
            ['email' => 'user@user.com'],
            [
                'name' => 'Regular User',
                'password' => Hash::make('password'),
                'role' => UserRole::User,
            ]
        );

        // Create some additional users if none exist
        if (User::count() <= 5) {
            User::factory(10)->create();
        }

        // Create Divisi and Issue Categories
        $divisions = [
            'IT' => [
                'Hardware',
                'Software',
                'Jaringan',
                'Akses Sistem',
            ],
            'HRD' => [
                'Payroll',
                'Cuti & Absensi',
                'Rekrutmen',
                'Pelatihan',
            ],
            'GA' => [
                'Fasilitas Kantor',
                'Kendaraan Operasional',
                'Kebersihan',
                'Keamanan',
            ],
            'Finance' => [
                'Invoicing',
                'Reimbursement',
                'Pajak',
                'Audit',
            ],
        ];

        foreach ($divisions as $divisionName => $categories) {
            $divisi = Divisi::updateOrCreate(
                ['name' => $divisionName],
                ['description' => "Divisi yang menangani operasional $divisionName."]
            );

            foreach ($categories as $categoryName) {
                IssueCategory::updateOrCreate(
                    [
                        'divisi_id' => $divisi->id,
                        'name' => $categoryName,
                    ],
                    ['description' => "Kategori masalah untuk $categoryName di divisi $divisionName."]
                );
            }
        }

        $this->call(TicketSeeder::class);
    }
}
