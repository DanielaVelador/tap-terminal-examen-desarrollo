<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use MongoDB\Operation\FindOneAndUpdate;

class Counter extends Model
{
    protected $connection = 'mongodb';

    protected $collection = 'counters';

    protected $fillable = ['name', 'value'];

    public static function next(string $name): int
    {
        $result = static::raw(function ($collection) use ($name) {
            return $collection->findOneAndUpdate(
                ['name' => $name],
                ['$inc' => ['value' => 1]],
                [
                    'upsert' => true,
                    'returnDocument' => FindOneAndUpdate::RETURN_DOCUMENT_AFTER,
                ]
            );
        });

        return $result->value;
    }
}
