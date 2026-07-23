<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; color: #08142b;">
    <h2>Claim #{{ $claim->id }} Update</h2>
    <p>Hello {{ $claim->user->name }},</p>
    <p>Your claim <strong>#{{ $claim->id }}</strong> ({{ $claim->type }}) status is now
        <strong>{{ $claim->status }}</strong>.</p>
    @if ($claim->status === 'Approved')
        <p>You can now proceed to pay this claim from your dashboard.</p>
    @endif
    <p>— Allianz Insurance Platform</p>
</body>
</html>
