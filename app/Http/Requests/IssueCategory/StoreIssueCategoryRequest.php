<?php

namespace App\Http\Requests\IssueCategory;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreIssueCategoryRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'divisi_id' => ['required', 'exists:divisis,id'],
            'name' => ['required', 'string', 'max:255', 'unique:issue_categories,name'],
            'description' => ['nullable', 'string'],
        ];
    }
}
