<?php

namespace App\Http\Controllers\Api\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\PasswordUpdateRequest;
use App\Services\ProfileService;
use Illuminate\Http\JsonResponse;

class SecurityController extends Controller
{
    public function __construct(
        protected ProfileService $profileService
    ) {}

    /**
     * Update the user's password.
     */
    public function update(PasswordUpdateRequest $request): JsonResponse
    {
        $this->profileService->updatePassword($request->user(), $request->password);

        return response()->json([
            'success' => true,
            'message' => 'Password berhasil diperbarui.',
        ]);
    }
}
