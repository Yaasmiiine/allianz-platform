<?php

namespace Database\Seeders;

use App\Models\Claim;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $admin = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'role' => 'admin',
        ]);

        $client = User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'role' => 'client',
        ]);

        Claim::factory()->create([
            'user_id' => $client->id,
            'type' => 'Car Accident',
            'description' => 'Rear-ended at a red light, bumper and tail light damage.',
            'amount' => 1200,
            'status' => 'Pending',
        ]);

        Claim::factory()->create([
            'user_id' => $client->id,
            'type' => 'Health',
            'description' => 'Emergency room visit for a broken wrist, requesting reimbursement.',
            'amount' => 850,
            'status' => 'Approved',
        ]);

        Claim::factory()->create([
            'user_id' => $client->id,
            'type' => 'Travel',
            'description' => 'Lost luggage during a flight connection, contents valued below.',
            'amount' => 300,
            'status' => 'Rejected',
        ]);
    }
}
