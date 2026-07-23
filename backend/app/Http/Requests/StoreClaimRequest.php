<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreClaimRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'type' => ['required', 'string', 'in:Car Accident,Health,Travel'],
            'description' => ['required', 'string', 'min:10', 'max:2000'],
            'amount' => ['required', 'numeric', 'min:0.01', 'max:1000000'],
            'document' => ['nullable', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:10240'],
        ];
    }
}
