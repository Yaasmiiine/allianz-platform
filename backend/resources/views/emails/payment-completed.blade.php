<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; color: #08142b;">
    <h2>Payment Received</h2>
    <p>Hello {{ $payment->user->name }},</p>
    <p>We've received your payment of <strong>${{ number_format($payment->amount, 2) }}</strong>
        for claim <strong>#{{ $payment->claim_id }}</strong>.</p>
    <p>Thank you for using Allianz Insurance Platform.</p>
</body>
</html>
