<?php

namespace App\Services;

use App\Models\IssueCategory;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class IssueCategoryService
{
    /**
     * Get all issue categories with their divisions.
     */
    public function getAllCategories(): Collection
    {
        return IssueCategory::with('divisi')->latest()->get();
    }

    /**
     * Get issue categories paginated with their divisions.
     */
    public function getCategoriesPaginated(int $perPage = 10): LengthAwarePaginator
    {
        return IssueCategory::with('divisi')->latest()->paginate($perPage);
    }

    /**
     * Create a new issue category.
     */
    public function createCategory(array $data): IssueCategory
    {
        return IssueCategory::create($data);
    }

    /**
     * Update an existing issue category.
     */
    public function updateCategory(IssueCategory $category, array $data): IssueCategory
    {
        $category->update($data);

        return $category;
    }

    /**
     * Delete an issue category.
     */
    public function deleteCategory(IssueCategory $category): bool
    {
        return $category->delete();
    }
}
