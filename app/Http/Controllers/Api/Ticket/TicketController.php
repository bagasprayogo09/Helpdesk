<?php

namespace App\Http\Controllers\Api\Ticket;

use App\Http\Controllers\Controller;
use App\Http\Requests\Ticket\StoreTicketRequest;
use App\Http\Requests\Ticket\UpdateTicketRequest;
use App\Http\Resources\Ticket\TicketResource;
use App\Models\Ticket;
use App\Services\TicketService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class TicketController extends Controller
{
    public function __construct(
        protected TicketService $ticketService
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $tickets = $this->ticketService->getTicketsForUser($request->user());

        return TicketResource::collection($tickets);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTicketRequest $request): JsonResponse
    {
        $ticket = $this->ticketService->createTicket($request->user(), $request->validated());
        $ticket->refresh();
        $ticket->load(['user', 'divisi', 'issueCategory', 'assignedTo']);

        return response()->json([
            'success' => true,
            'message' => 'Tiket berhasil dibuat.',
            'data' => new TicketResource($ticket),
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Ticket $ticket): TicketResource
    {
        $detailedTicket = $this->ticketService->getTicketDetails($ticket);

        return new TicketResource($detailedTicket);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTicketRequest $request, Ticket $ticket): JsonResponse
    {
        $updatedTicket = $this->ticketService->updateTicket($ticket, $request->validated());
        $updatedTicket->load(['user', 'divisi', 'issueCategory', 'assignedTo']);

        return response()->json([
            'success' => true,
            'message' => 'Tiket berhasil diperbarui.',
            'data' => new TicketResource($updatedTicket),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Ticket $ticket): JsonResponse
    {
        $this->ticketService->deleteTicket($ticket);

        return response()->json([
            'success' => true,
            'message' => 'Tiket berhasil dihapus.',
        ]);
    }
}
