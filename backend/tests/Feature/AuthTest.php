<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthTest extends TestCase
{
    public function test_register_rejects_weak_password(): void
    {
        $response = $this->postJson('/api/register', [
            'name' => 'Jane Doe',
            'email' => 'jane@example.com',
            'password' => 'short',
            'password_confirmation' => 'short',
        ]);

        $response->assertStatus(422)->assertJsonValidationErrors('password');
    }

    public function test_register_rejects_duplicate_email(): void
    {
        User::factory()->create(['email' => 'jane@example.com']);

        $response = $this->postJson('/api/register', [
            'name' => 'Jane Doe',
            'email' => 'jane@example.com',
            'password' => 'Password123',
            'password_confirmation' => 'Password123',
        ]);

        $response->assertStatus(422)->assertJsonValidationErrors('email');
    }

    public function test_register_succeeds_and_returns_token(): void
    {
        $response = $this->postJson('/api/register', [
            'name' => 'Jane Doe',
            'email' => 'jane@example.com',
            'password' => 'Password123',
            'password_confirmation' => 'Password123',
        ]);

        $response->assertStatus(201)->assertJsonStructure(['user', 'token']);
        $this->assertDatabaseHas('users', ['email' => 'jane@example.com', 'role' => 'client']);
    }

    public function test_login_fails_with_invalid_credentials(): void
    {
        User::factory()->create([
            'email' => 'jane@example.com',
            'password' => Hash::make('Password123'),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'jane@example.com',
            'password' => 'WrongPassword',
        ]);

        $response->assertStatus(401);
    }

    public function test_login_succeeds_with_valid_credentials(): void
    {
        User::factory()->create([
            'email' => 'jane@example.com',
            'password' => Hash::make('Password123'),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'jane@example.com',
            'password' => 'Password123',
        ]);

        $response->assertStatus(200)->assertJsonStructure(['user', 'token']);
    }

    public function test_login_is_rate_limited_after_repeated_attempts(): void
    {
        for ($i = 0; $i < 5; $i++) {
            $this->postJson('/api/login', [
                'email' => 'nobody@example.com',
                'password' => 'WrongPassword',
            ]);
        }

        $response = $this->postJson('/api/login', [
            'email' => 'nobody@example.com',
            'password' => 'WrongPassword',
        ]);

        $response->assertStatus(429);
    }

    public function test_logout_revokes_token(): void
    {
        $user = User::factory()->create();
        $newToken = $user->createToken('auth_token');
        $tokenId = $newToken->accessToken->id;

        $logoutResponse = $this->withHeader('Authorization', 'Bearer ' . $newToken->plainTextToken)
            ->postJson('/api/logout');

        $logoutResponse->assertStatus(200);
        $this->assertDatabaseMissing('personal_access_tokens', ['id' => $tokenId]);
    }
}
