<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Claim extends Model
{
    protected $fillable = [
    'type',
    'description',
    'amount',
    'status',
    'document',
    'user_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
