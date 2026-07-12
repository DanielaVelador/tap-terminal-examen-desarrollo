<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Profile;

class CheckSectionAccess
{
    public function handle(Request $request, Closure $next, string $section)
    {
        $user = Auth::guard('api')->user();

        if (! $user) {
            return response()->json(['error' => 'No autenticado'], 401);
        }

        $profileIds = $user->profile_ids ?? [];

        if (empty($profileIds)) {
            return response()->json(['error' => 'No tienes perfiles asignados'], 403);
        }

        $profiles = Profile::whereIn('_id', $profileIds)->get();

        $allowedSectionIds = $profiles->pluck('section_ids')->flatten()->unique();

        $hasAccess = \App\Models\Section::whereIn('_id', $allowedSectionIds)
            ->where('route', $section)
            ->exists();

        if (! $hasAccess) {
            return response()->json(['error' => 'No tienes acceso a esta sección'], 403);
        }

        return $next($request);
    }
}