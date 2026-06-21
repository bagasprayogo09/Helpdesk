<?php

namespace App\Services;

use App\Models\Divisi;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class DivisiService
{
    /**
     * Get all divisions.
     */
    public function getAllDivisions(): Collection
    {
        return Divisi::latest()->get();
    }

    /**
     * Get divisions paginated.
     */
    public function getDivisionsPaginated(int $perPage = 10): LengthAwarePaginator
    {
        return Divisi::latest()->paginate($perPage);
    }

    /**
     * Create a new division.
     */
    public function createDivision(array $data): Divisi
    {
        return Divisi::create($data);
    }

    /**
     * Update an existing division.
     */
    public function updateDivision(Divisi $divisi, array $data): Divisi
    {
        $divisi->update($data);

        return $divisi;
    }

    /**
     * Delete a division.
     */
    public function deleteDivision(Divisi $divisi): bool
    {
        return $divisi->delete();
    }
}
