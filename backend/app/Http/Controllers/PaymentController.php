<?php

namespace App\Http\Controllers;

use App\Http\Requests\CheckoutRequest;
use App\Http\Requests\ConfirmPaymentRequest;
use App\Mail\PaymentCompletedMail;
use App\Models\Claim;
use App\Models\User;
use App\Models\Payment;
use Illuminate\Http\Request;
use App\Models\Notification;
use Illuminate\Support\Facades\Mail;
use Stripe\Stripe;
use Stripe\Checkout\Session;

class PaymentController extends Controller
{
    public function createCheckoutSession(CheckoutRequest $request)
    {
        $claim = Claim::findOrFail($request->validated('claim_id'));

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
            'success_url' => env('FRONTEND_URL') . '/payment-success?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => env('FRONTEND_URL') . '/payment-cancel',
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

    public function confirmPayment(ConfirmPaymentRequest $request)
    {
        $payment = Payment::where('stripe_session_id', $request->validated('session_id'))->first();

        if (!$payment) {
            return response()->json(['message' => 'Payment not found'], 404);
        }

        if ($payment->status === 'completed') {
            return response()->json([
                'message' => 'Payment already confirmed',
                'payment' => $payment,
            ]);
        }

        Stripe::setApiKey(env('STRIPE_SECRET'));

        $session = Session::retrieve($request->validated('session_id'));

        if ($session->payment_status === 'paid') {
            $payment->status = 'completed';
            $payment->save();

            Notification::create([
                'user_id' => $payment->user_id,
                'title' => 'Payment Completed',
                'message' => 'Your payment for claim #' . $payment->claim_id . ' has been completed successfully.',
            ]);

            Mail::to($payment->user->email)->send(new PaymentCompletedMail($payment));

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
        $query = $request->user()->role === 'admin'
            ? Payment::with('user', 'claim')
            : $request->user()->payments()->with('claim');

        if ($claimId = $request->query('claim_id')) {
            return $query->where('claim_id', $claimId)->latest()->get();
        }

        $perPage = min((int) $request->query('per_page', 15), 100);

        return $query->latest()->paginate($perPage)->withQueryString();
    }
}
