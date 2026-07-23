<?php

namespace Database\Factories;

use App\Models\Claim;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Claim>
 */
class ClaimFactory extends Factory
{
    protected $model = Claim::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'type' => fake()->randomElement(['Car Accident', 'Health', 'Travel']),
            'description' => fake()->sentence(12),
            'amount' => fake()->randomFloat(2, 100, 5000),
            'status' => 'Pending',
            'document' => null,
        ];
    }
}
