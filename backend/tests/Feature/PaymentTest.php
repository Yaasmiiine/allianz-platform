<?php

namespace Tests\Feature;

use App\Models\Claim;
use App\Models\Notification;
use App\Models\Payment;
use App\Models\User;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PaymentTest extends TestCase
{
    public function test_checkout_blocked_for_claim_not_owned_by_user(): void
    {
        $owner = User::factory()->create(['role' => 'client']);
        $otherClient = User::factory()->create(['role' => 'client']);
        $claim = Claim::factory()->create(['user_id' => $owner->id, 'status' => 'Approved']);

        Sanctum::actingAs($otherClient);

        $response = $this->postJson('/api/payments/checkout', ['claim_id' => $claim->id]);

        $response->assertStatus(403);
    }

    public function test_checkout_blocked_for_non_approved_claim(): void
    {
        $client = User::factory()->create(['role' => 'client']);
        $claim = Claim::factory()->create(['user_id' => $client->id, 'status' => 'Pending']);

        Sanctum::actingAs($client);

        $response = $this->postJson('/api/payments/checkout', ['claim_id' => $claim->id]);

        $response->assertStatus(400);
    }

    public function test_confirm_payment_is_idempotent(): void
    {
        $client = User::factory()->create(['role' => 'client']);
        $claim = Claim::factory()->create(['user_id' => $client->id, 'status' => 'Approved']);
        $payment = Payment::factory()->create([
            'user_id' => $client->id,
            'claim_id' => $claim->id,
            'status' => 'completed',
        ]);

        Sanctum::actingAs($client);

        $response = $this->postJson('/api/payments/confirm', [
            'session_id' => $payment->stripe_session_id,
        ]);

        $response->assertStatus(200)->assertJson(['message' => 'Payment already confirmed']);
        $this->assertSame(0, Notification::where('user_id', $client->id)->count());
    }
}
