<?php

namespace App\Http\Controllers\Api\IssueCategory;

use App\Http\Controllers\Controller;
use App\Http\Requests\IssueCategory\StoreIssueCategoryRequest;
use App\Http\Requests\IssueCategory\UpdateIssueCategoryRequest;
use App\Http\Resources\IssueCategory\IssueCategoryResource;
use App\Models\IssueCategory;
use App\Services\IssueCategoryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class IssueCategoryController extends Controller
{
    public function __construct(
        protected IssueCategoryService $categoryService
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(): AnonymousResourceCollection
    {
        $categories = $this->categoryService->getCategoriesPaginated();

        return IssueCategoryResource::collection($categories);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreIssueCategoryRequest $request): JsonResponse
    {
        $category = $this->categoryService->createCategory($request->validated());
        $category->load('divisi');

        return response()->json([
            'success' => true,
            'message' => 'Kategori masalah berhasil dibuat.',
            'data' => new IssueCategoryResource($category),
        ], 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateIssueCategoryRequest $request, IssueCategory $issueCategory): JsonResponse
    {
        $this->categoryService->updateCategory($issueCategory, $request->validated());
        $issueCategory->refresh()->load('divisi');

        return response()->json([
            'success' => true,
            'message' => 'Kategori masalah berhasil diperbarui.',
            'data' => new IssueCategoryResource($issueCategory),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(IssueCategory $issueCategory): JsonResponse
    {
        $this->categoryService->deleteCategory($issueCategory);

        return response()->json([
            'success' => true,
            'message' => 'Kategori masalah berhasil dihapus.',
        ]);
    }
}
