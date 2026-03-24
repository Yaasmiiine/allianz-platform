<?php

namespace App\Http\Controllers;

use App\Models\Claim;
use App\Models\User;
use App\Models\Payment;
use Illuminate\Http\Request;
use App\Models\Notification;
use Stripe\Stripe;
use Stripe\Checkout\Session;

class PaymentController extends Controller
{
    public function createCheckoutSession(Request $request)
    {
        $request->validate([
            'claim_id' => 'required|exists:claims,id',
        ]);

        $claim = Claim::findOrFail($request->claim_id);

        if ($claim->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($claim->status !== 'Approved') {
            return response()->json(['message' => 'Only approved claims can be paid'], 400);
        }

        Stripe::setApiKey(env('STRIPE_SECRET'));

        $session = Session::create([
            'payment_method_types' => ['card'],
            'mode' => 'payment',
            'line_items' => [[
                'price_data' => [
                    'currency' => 'usd',
                    'product_data' => [
                        'name' => 'Insurance Claim Payment #' . $claim->id,
                    ],
                    'unit_amount' => (int) ($claim->amount * 100),
                ],
                'quantity' => 1,
            ]],
            'success_url' => 'http://localhost:5173/payment-success?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => 'http://localhost:5173/payment-cancel',
        ]);

        Payment::create([
            'user_id' => $request->user()->id,
            'claim_id' => $claim->id,
            'amount' => $claim->amount,
            'status' => 'pending',
            'stripe_session_id' => $session->id,
        ]);

        return response()->json([
            'url' => $session->url,
        ]);
    }

    public function confirmPayment(Request $request)
{
    $request->validate([
        'session_id' => 'required|string',
    ]);

    Stripe::setApiKey(env('STRIPE_SECRET'));

    $session = \Stripe\Checkout\Session::retrieve($request->session_id);

    $payment = Payment::where('stripe_session_id', $request->session_id)->first();

    if (!$payment) {
        return response()->json(['message' => 'Payment not found'], 404);
    }

    if ($session->payment_status === 'paid') {
        $payment->status = 'completed';
        $payment->save();

        // Notification for client
        Notification::create([
            'user_id' => $payment->user_id,
            'title' => 'Payment Completed',
            'message' => 'Your payment for claim #' . $payment->claim_id . ' has been completed successfully.',
        ]);

        // Notifications for all admins
        $admins = User::where('role', 'admin')->get();

        foreach ($admins as $admin) {
            Notification::create([
                'user_id' => $admin->id,
                'title' => 'Claim Payment Received',
                'message' => 'A client has completed payment for claim #' . $payment->claim_id . '.',
            ]);
        }

        return response()->json([
            'message' => 'Payment confirmed successfully',
            'payment' => $payment,
        ]);
    }

    return response()->json([
        'message' => 'Payment not completed',
    ], 400);
}

    public function index(Request $request)
    {
        if ($request->user()->role === 'admin') {
            return Payment::with('user', 'claim')->latest()->get();
        }

        return $request->user()->payments()->latest()->get();
    }
}