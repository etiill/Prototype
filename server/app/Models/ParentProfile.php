<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ParentProfile extends Model
{
    protected $table = 'parents';

    protected $fillable = ['user_id', 'phone_number'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
