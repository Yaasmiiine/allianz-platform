<?php

namespace App\Http\Controllers;

use App\Models\Claim;
use App\Models\Payment;
use Illuminate\Http\Request;

class StatsController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $isAdmin = $user->role === 'admin';

        $claims = fn () => Claim::query()->when(! $isAdmin, fn ($q) => $q->where('user_id', $user->id));
        $payments = fn () => Payment::query()->when(! $isAdmin, fn ($q) => $q->where('user_id', $user->id));

        $claimsByStatus = $claims()
            ->selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status');

        $monthlyClaims = $claims()
            ->where('created_at', '>=', now()->subMonths(5)->startOfMonth())
            ->get(['created_at']);

        $claimsPerMonth = collect(range(5, 0))->map(function ($monthsAgo) use ($monthlyClaims) {
            $month = now()->subMonths($monthsAgo);

            return [
                'month' => $month->format('Y-m'),
                'count' => $monthlyClaims->filter(fn ($c) => $c->created_at->isSameMonth($month))->count(),
            ];
        })->values();

        return response()->json([
            'claims_by_status' => [
                'Pending' => $claimsByStatus->get('Pending', 0),
                'Approved' => $claimsByStatus->get('Approved', 0),
                'Rejected' => $claimsByStatus->get('Rejected', 0),
            ],
            'total_claims' => $claims()->count(),
            'total_claims_amount' => (float) $claims()->sum('amount'),
            'total_paid_amount' => (float) $payments()->where('status', 'completed')->sum('amount'),
            'claims_per_month' => $claimsPerMonth,
            'recent_claims' => $claims()->latest()->take(5)->get(),
            'recent_payments' => $payments()->with('claim')->latest()->take(5)->get(),
        ]);
    }
}
