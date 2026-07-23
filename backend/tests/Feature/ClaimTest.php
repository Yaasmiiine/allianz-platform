<?php

namespace Tests\Feature;

use App\Models\Claim;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ClaimTest extends TestCase
{
    public function test_client_can_submit_a_valid_claim(): void
    {
        $client = User::factory()->create(['role' => 'client']);
        Sanctum::actingAs($client);

        $response = $this->postJson('/api/claims', [
            'type' => 'Health',
            'description' => 'Emergency room visit after a fall at work.',
            'amount' => 500,
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('claims', ['user_id' => $client->id, 'status' => 'Pending']);
    }

    public function test_claim_submission_rejects_invalid_type_and_negative_amount(): void
    {
        $client = User::factory()->create(['role' => 'client']);
        Sanctum::actingAs($client);

        $response = $this->postJson('/api/claims', [
            'type' => 'Fire',
            'description' => 'Not a valid claim type at all.',
            'amount' => -5,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['type', 'amount']);
    }

    public function test_client_only_sees_own_claims(): void
    {
        $client = User::factory()->create(['role' => 'client']);
        $otherClient = User::factory()->create(['role' => 'client']);

        Claim::factory()->create(['user_id' => $client->id]);
        Claim::factory()->create(['user_id' => $otherClient->id]);

        Sanctum::actingAs($client);

        $response = $this->getJson('/api/claims');

        $response->assertStatus(200);
        $this->assertCount(1, $response->json('data'));
    }

    public function test_admin_sees_all_claims(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $client = User::factory()->create(['role' => 'client']);

        Claim::factory()->count(3)->create(['user_id' => $client->id]);

        Sanctum::actingAs($admin);

        $response = $this->getJson('/api/claims');

        $response->assertStatus(200);
        $this->assertCount(3, $response->json('data'));
    }

    public function test_claims_can_be_filtered_by_status_and_searched(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $client = User::factory()->create(['role' => 'client']);

        Claim::factory()->create(['user_id' => $client->id, 'status' => 'Approved', 'description' => 'car crash on the highway']);
        Claim::factory()->create(['user_id' => $client->id, 'status' => 'Pending', 'description' => 'broken arm at work']);

        Sanctum::actingAs($admin);

        $response = $this->getJson('/api/claims?status=Approved&search=highway');

        $response->assertStatus(200);
        $this->assertCount(1, $response->json('data'));
    }

    public function test_non_admin_cannot_update_claim_status(): void
    {
        $client = User::factory()->create(['role' => 'client']);
        $claim = Claim::factory()->create(['user_id' => $client->id]);

        Sanctum::actingAs($client);

        $response = $this->putJson("/api/claims/{$claim->id}/status", ['status' => 'Approved']);

        $response->assertStatus(403);
    }

    public function test_admin_can_update_claim_status_and_triggers_notification_and_email(): void
    {
        Mail::fake();

        $admin = User::factory()->create(['role' => 'admin']);
        $client = User::factory()->create(['role' => 'client']);
        $claim = Claim::factory()->create(['user_id' => $client->id, 'status' => 'Pending']);

        Sanctum::actingAs($admin);

        $response = $this->putJson("/api/claims/{$claim->id}/status", ['status' => 'Approved']);

        $response->assertStatus(200);
        $this->assertDatabaseHas('claims', ['id' => $claim->id, 'status' => 'Approved']);
        $this->assertDatabaseHas('notifications', ['user_id' => $client->id, 'title' => 'Claim Status Updated']);
        Mail::assertSent(\App\Mail\ClaimStatusUpdatedMail::class);
    }
}
