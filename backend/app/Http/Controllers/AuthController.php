<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Profile;
use App\Models\Section;
use App\Mail\PasswordResetMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $credentials = $request->only('email', 'password');

        if (! $token = Auth::guard('api')->attempt($credentials)) {
            return response()->json(['error' => 'Credenciales inválidas'], 401);
        }

        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => Auth::guard('api')->factory()->getTTL() * 60,
        ]);
    }

    public function logout()
    {
        Auth::guard('api')->logout();

        return response()->json(['message' => 'Sesión cerrada correctamente']);
    }

    public function me()
    {
        return response()->json(Auth::guard('api')->user());
    }

    public function forgotPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user = User::where('email', $request->email)->first();

        if (! $user) {
            return response()->json(['error' => 'No existe un usuario con ese correo'], 404);
        }

        $newPassword = Str::random(10);

        $user->password = bcrypt($newPassword);
        $user->save();

        Mail::to($user->email)->send(new PasswordResetMail($newPassword, $user->name));

        return response()->json(['message' => 'Se ha enviado una nueva contraseña a tu correo']);
    }
    public function mySections()
    {
        $user = Auth::guard('api')->user();

        $profiles = Profile::whereIn('_id', $user->profile_ids ?? [])->get();

        $sectionIds = $profiles->pluck('section_ids')->flatten()->unique()->filter()->values();

        $sections = Section::whereIn('_id', $sectionIds)->get(['route']);

        return response()->json($sections->pluck('route'));
    }
}
