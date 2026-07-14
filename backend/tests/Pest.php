<?php

use Tests\TestCase;
use App\Models\User;
use App\Models\Product;
use App\Models\Profile;
use App\Models\Section;
use App\Models\Counter;

/*
|--------------------------------------------------------------------------
| Test Case
|--------------------------------------------------------------------------
*/

uses(TestCase::class)->in('Feature');

function cleanTestCollections(): void
{
    User::query()->delete();
    Product::query()->delete();
    Profile::query()->delete();
    Section::query()->delete();
    Counter::query()->delete();
}