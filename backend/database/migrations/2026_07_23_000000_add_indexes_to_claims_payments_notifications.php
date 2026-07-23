<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('claims', function (Blueprint $table) {
            $table->index('status');
            $table->index('type');
        });

        Schema::table('payments', function (Blueprint $table) {
            $table->index('status');
            $table->unique('stripe_session_id');
        });

        Schema::table('notifications', function (Blueprint $table) {
            $table->index('is_read');
        });
    }

    public function down(): void
    {
        Schema::table('claims', function (Blueprint $table) {
            $table->dropIndex(['status']);
            $table->dropIndex(['type']);
        });

        Schema::table('payments', function (Blueprint $table) {
            $table->dropIndex(['status']);
            $table->dropUnique(['stripe_session_id']);
        });

        Schema::table('notifications', function (Blueprint $table) {
            $table->dropIndex(['is_read']);
        });
    }
};
