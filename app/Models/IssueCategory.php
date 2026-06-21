<?php

namespace App\Models;

use App\Concerns\LogsActivity;
use Database\Factories\IssueCategoryFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class IssueCategory extends Model
{
    /** @use HasFactory<IssueCategoryFactory> */
    use HasFactory, LogsActivity;

    protected $fillable = [
        'divisi_id',
        'name',
        'description',
    ];

    /**
     * Get the division that owns the issue category.
     */
    public function divisi(): BelongsTo
    {
        return $this->belongsTo(Divisi::class);
    }
}
