<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreClaimRequest;
use App\Http\Requests\UpdateClaimStatusRequest;
use App\Mail\ClaimStatusUpdatedMail;
use App\Models\Claim;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ClaimController extends Controller
{
    public function index(Request $request)
    {
        $perPage = min((int) $request->query('per_page', 15), 100);

        $query = $request->user()->role === 'admin'
            ? Claim::with('user')
            : $request->user()->claims();

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        if ($type = $request->query('type')) {
            $query->where('type', $type);
        }

        if ($search = $request->query('search')) {
            $query->where('description', 'like', '%' . $search . '%');
        }

        return $query->latest()->paginate($perPage)->withQueryString();
    }

    public function store(StoreClaimRequest $request)
    {
        $documentPath = null;

        if ($request->hasFile('document')) {
            $documentPath = $request->file('document')->store('claims', 'public');
        }

        $claim = Claim::create([
            'type' => $request->validated('type'),
            'description' => $request->validated('description'),
            'amount' => $request->validated('amount'),
            'status' => 'Pending',
            'document' => $documentPath,
            'user_id' => $request->user()->id,
        ]);

        Notification::create([
            'user_id' => $request->user()->id,
            'title' => 'Claim Submitted',
            'message' => 'Your claim has been submitted and is pending review.',
        ]);

        $admins = User::where('role', 'admin')->get();

        foreach ($admins as $admin) {
            Notification::create([
                'user_id' => $admin->id,
                'title' => 'New Claim Submitted',
                'message' => 'A new claim #' . $claim->id . ' has been submitted and requires review.',
            ]);
        }

        return response()->json($claim, 201);
    }

    public function updateStatus(UpdateClaimStatusRequest $request, $id)
    {
        $claim = Claim::findOrFail($id);
        $claim->status = $request->validated('status');
        $claim->save();

        Notification::create([
            'user_id' => $claim->user_id,
            'title' => 'Claim Status Updated',
            'message' => 'Your claim #' . $claim->id . ' status is now ' . $claim->status . '.',
        ]);

        Mail::to($claim->user->email)->send(new ClaimStatusUpdatedMail($claim));

        return response()->json([
            'message' => 'Claim status updated successfully',
            'claim' => $claim
        ]);
    }

    public function show(Request $request, $id)
    {
        $claim = Claim::with('user')->findOrFail($id);

        if ($request->user()->role !== 'admin' && $claim->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($claim);
    }
}
