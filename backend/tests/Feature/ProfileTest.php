<?php

namespace Tests\Feature;

use App\Models\User;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ProfileTest extends TestCase
{
    public function test_user_can_update_their_profile(): void
    {
        $user = User::factory()->create(['name' => 'Old Name']);
        Sanctum::actingAs($user);

        $response = $this->putJson('/api/profile', [
            'name' => 'New Name',
            'email' => $user->email,
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('users', ['id' => $user->id, 'name' => 'New Name']);
    }

    public function test_profile_update_rejects_email_already_taken_by_another_user(): void
    {
        $user = User::factory()->create();
        $other = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->putJson('/api/profile', [
            'name' => $user->name,
            'email' => $other->email,
        ]);

        $response->assertStatus(422)->assertJsonValidationErrors('email');
    }
}
