<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Log extends Model
{
    protected $connection = 'mongodb';

    protected $collection = 'logs';

    protected $fillable = [
        'collection_name',
        'document_id',
        'action',
        'previous_data',
        'new_data',
        'user_id',
        'created_at',
    ];
}
