<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Section extends Model
{
    protected $connection = 'mongodb';

    protected $collection = 'sections';

    protected $fillable = [
        'name',
        'route',
        'created_at',
    ];
}
