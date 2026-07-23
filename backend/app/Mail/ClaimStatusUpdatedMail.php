<?php

namespace App\Mail;

use App\Models\Claim;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ClaimStatusUpdatedMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Claim $claim)
    {
    }

    public function build()
    {
        return $this->subject('Your claim #' . $this->claim->id . ' status has been updated')
            ->view('emails.claim-status-updated');
    }
}
