<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'user_id',
        'claim_id',
        'amount',
        'status',
        'stripe_session_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function claim()
    {
        return $this->belongsTo(Claim::class);
    }
}