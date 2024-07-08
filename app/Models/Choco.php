<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Choco extends Model
{
    use HasFactory;

    protected $casts = [
        'allDay' => 'boolean',
    ];

    protected $fillable = [
        'title',
        'color',
        'start',
        'end',
        'allDay',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
