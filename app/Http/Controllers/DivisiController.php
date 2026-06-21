<?php

namespace App\Http\Controllers;

use App\Http\Resources\Divisi\DivisiResource;
use App\Services\DivisiService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DivisiController extends Controller
{
    public function __construct(
        protected DivisiService $divisiService
    ) {}

    /**
     * Display the divisions index page.
     */
    public function index(Request $request): Response
    {
        $divisis = $this->divisiService->getDivisionsPaginated();

        return Inertia::render('divisi/index', [
            'divisis' => DivisiResource::collection($divisis),
        ]);
    }
}
