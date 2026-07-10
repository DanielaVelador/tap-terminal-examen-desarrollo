<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Profile extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'profiles';

    protected $fillable = [
        'name',
        'section_ids',
        'created_at',
    ];

    public function sections()
    {
        return $this->hasMany(Section::class, '_id', 'section_ids');
    }
}