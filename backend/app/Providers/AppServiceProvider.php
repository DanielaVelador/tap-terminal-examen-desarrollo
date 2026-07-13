<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Models\Product;
use App\Models\User;
use App\Models\Profile;
use App\Models\Section;
use App\Observers\AuditObserver;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Product::observe(AuditObserver::class);
        User::observe(AuditObserver::class);
        Profile::observe(AuditObserver::class);
        Section::observe(AuditObserver::class);
    }
}
