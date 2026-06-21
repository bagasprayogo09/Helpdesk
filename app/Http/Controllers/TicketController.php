<?php

namespace App\Http\Controllers;

use App\Http\Resources\Ticket\TicketResource;
use App\Models\Ticket;
use App\Services\TicketService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TicketController extends Controller
{
    public function __construct(
        protected TicketService $ticketService
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $tickets = $this->ticketService->getTicketsForUser($request->user());

        return Inertia::render('tickets/index', [
            'tickets' => TicketResource::collection($tickets),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $data = $this->ticketService->getCreateData();

        return Inertia::render('tickets/create', [
            'divisis' => $data['divisis'],
            'issue_categories' => $data['issue_categories'],
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Ticket $ticket): Response
    {
        $detailedTicket = $this->ticketService->getTicketDetails($ticket);

        return Inertia::render('tickets/show', [
            'ticket' => new TicketResource($detailedTicket),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Ticket $ticket): Response
    {
        $data = $this->ticketService->getEditData($ticket);

        return Inertia::render('tickets/edit', [
            'ticket' => new TicketResource($data['ticket']),
            'divisis' => $data['divisis'],
            'issue_categories' => $data['issue_categories'],
            'agents' => $data['agents'],
        ]);
    }
}
