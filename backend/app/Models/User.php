<?php

namespace App\Models;

use Illuminate\Notifications\Notifiable;
use MongoDB\Laravel\Auth\User as Authenticatable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use Notifiable;

    protected $connection = 'mongodb';

    protected $collection = 'users';

    protected $fillable = [
        'code',
        'name',
        'email',
        'password',
        'phone',
        'profile_photo',
        'profile_ids',
        'created_at',
    ];

    protected $hidden = [
        'password',
    ];

    public function profiles()
    {
        return $this->hasMany(Profile::class, '_id', 'profile_ids');
    }

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }
}
