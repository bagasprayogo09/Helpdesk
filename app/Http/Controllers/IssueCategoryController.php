<?php

namespace App\Http\Controllers;

use App\Http\Resources\Divisi\DivisiResource;
use App\Http\Resources\IssueCategory\IssueCategoryResource;
use App\Models\Divisi;
use App\Services\IssueCategoryService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class IssueCategoryController extends Controller
{
    public function __construct(
        protected IssueCategoryService $categoryService
    ) {}

    /**
     * Display the issue categories index page.
     */
    public function index(Request $request): Response
    {
        $categories = $this->categoryService->getCategoriesPaginated();
        $divisis = Divisi::all();

        return Inertia::render('issue-category/index', [
            'issueCategories' => IssueCategoryResource::collection($categories),
            'divisis' => DivisiResource::collection($divisis),
        ]);
    }
}
