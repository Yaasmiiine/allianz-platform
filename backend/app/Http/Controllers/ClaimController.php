<?php

namespace App\Http\Controllers;

use App\Models\Claim;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;

class ClaimController extends Controller
{
    public function index(Request $request)
    {
        if ($request->user()->role === 'admin') {
            return Claim::with('user')->latest()->get();
        }

        return $request->user()->claims()->latest()->get();
    }

    public function store(Request $request)
{
    $request->validate([
        'type' => 'required|string',
        'description' => 'required|string',
        'amount' => 'required|numeric',
        'document' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
    ]);

    $documentPath = null;

    if ($request->hasFile('document')) {
        $documentPath = $request->file('document')->store('claims', 'public');
    }

    $claim = Claim::create([
        'type' => $request->type,
        'description' => $request->description,
        'amount' => $request->amount,
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

    public function updateStatus(Request $request, $id)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'status' => 'required|in:Pending,Approved,Rejected',
        ]);

        $claim = Claim::findOrFail($id);
        $claim->status = $request->status;
        $claim->save();

        Notification::create([
            'user_id' => $claim->user_id,
            'title' => 'Claim Status Updated',
            'message' => 'Your claim #' . $claim->id . ' status is now ' . $claim->status . '.',
        ]);

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