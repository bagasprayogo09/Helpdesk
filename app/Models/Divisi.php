<?php

namespace App\Models;

use App\Concerns\LogsActivity;
use Database\Factories\DivisiFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Divisi extends Model
{
    /** @use HasFactory<DivisiFactory> */
    use HasFactory, LogsActivity;

    protected $fillable = [
        'name',
        'description',
    ];

    /**
     * Get the issue categories for the division.
     */
    public function issueCategories(): HasMany
    {
        return $this->hasMany(IssueCategory::class);
    }
}
