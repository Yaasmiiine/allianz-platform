<?php

namespace Database\Factories;

use App\Models\Claim;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Payment>
 */
class PaymentFactory extends Factory
{
    protected $model = Payment::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'claim_id' => Claim::factory(),
            'amount' => fake()->randomFloat(2, 100, 5000),
            'status' => 'pending',
            'stripe_session_id' => 'cs_test_' . fake()->unique()->uuid(),
        ];
    }
}
