<?php

namespace App\Http\Controllers;

use App\Http\Requests\AuditLogIndexRequest;
use App\Services\AuditLogService;
use Inertia\Inertia;
use Inertia\Response;

class AuditLogController extends Controller
{
    public function __construct(
        protected AuditLogService $auditLogService
    ) {}

    public function index(AuditLogIndexRequest $request): Response
    {
        $filters = $request->validated();

        $logs = $this->auditLogService->getPaginatedLogs($filters);

        return Inertia::render('audit-logs/index', [
            'logs' => $logs,
            'filters' => $filters,
        ]);
    }
}