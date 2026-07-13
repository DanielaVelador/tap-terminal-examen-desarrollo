<?php

namespace App\Observers;

use App\Models\Log;
use Illuminate\Support\Facades\Auth;

class AuditObserver
{
    public function created($model): void
    {
        $this->record($model, 'created', null, $this->sanitize($model->toArray()));
    }

    public function updated($model): void
    {
        $this->record(
            $model,
            'updated',
            $this->sanitize($model->getOriginal()),
            $this->sanitize($model->getChanges())
        );
    }

    public function deleted($model): void
    {
        $this->record($model, 'deleted', $this->sanitize($model->toArray()), null);
    }

    private function record($model, string $action, ?array $previous, ?array $new): void
    {
        Log::create([
            'collection_name' => $model->getTable(),
            'document_id'     => (string) $model->getKey(),
            'action'          => $action,
            'previous_data'   => $previous,
            'new_data'        => $new,
            'user_id'         => optional(Auth::guard('api')->user())->getKey(),
        ]);
    }

    private function sanitize(array $data): array
    {
        unset($data['password']);
        return $data;
    }
}
