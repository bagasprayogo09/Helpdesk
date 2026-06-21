<?php

namespace App\Http\Controllers\Api\Divisi;

use App\Http\Controllers\Controller;
use App\Http\Requests\Divisi\StoreDivisiRequest;
use App\Http\Requests\Divisi\UpdateDivisiRequest;
use App\Http\Resources\Divisi\DivisiResource;
use App\Models\Divisi;
use App\Services\DivisiService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class DivisiController extends Controller
{
    public function __construct(
        protected DivisiService $divisiService
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(): AnonymousResourceCollection
    {
        $divisis = $this->divisiService->getDivisionsPaginated();

        return DivisiResource::collection($divisis);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDivisiRequest $request): JsonResponse
    {
        $divisi = $this->divisiService->createDivision($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Divisi berhasil dibuat.',
            'data' => new DivisiResource($divisi),
        ], 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDivisiRequest $request, Divisi $divisi): JsonResponse
    {
        $this->divisiService->updateDivision($divisi, $request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Divisi berhasil diperbarui.',
            'data' => new DivisiResource($divisi->fresh()),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Divisi $divisi): JsonResponse
    {
        $this->divisiService->deleteDivision($divisi);

        return response()->json([
            'success' => true,
            'message' => 'Divisi berhasil dihapus.',
        ]);
    }
}
