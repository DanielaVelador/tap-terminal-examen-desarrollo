<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Profile;
use App\Models\Counter;
use App\Exports\UsersExport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use libphonenumber\PhoneNumberUtil;
use Maatwebsite\Excel\Facades\Excel;
use Barryvdh\DomPDF\Facade\Pdf;

class UserController extends Controller
{
    public function index()
    {
        return response()->json(User::orderBy('created_at', 'desc')->get());
    }

    public function show(string $id)
    {
        $user = User::find($id);

        if (! $user) {
            return response()->json(['error' => 'Usuario no encontrado'], 404);
        }

        $profiles = Profile::whereIn('_id', $user->profile_ids ?? [])->get();

        return response()->json([
            'user' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'profile_photo' => $user->profile_photo,
            'profiles' => $profiles,
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'  => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'nullable|string',
            'profile_photo' => 'required|image|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        if ($request->filled('phone') && ! $this->isValidPhone($request->phone)) {
            return response()->json(['error' => 'El teléfono debe incluir código de país válido, ej. +521234567890'], 422);
        }

        $photoPath = $request->file('profile_photo')->store('profiles', 'public');

        $sequence = Counter::next('users');
        $code = 'USR-' . str_pad($sequence, 4, '0', STR_PAD_LEFT);

        $user = User::create([
            'code'  => $code,
            'name'  => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'profile_photo' => $photoPath,
            'password' => bcrypt(str()->random(12)),
        ]);

        return response()->json($user, 201);
    }

    public function update(Request $request, string $id)
    {
        $user = User::find($id);

        if (! $user) {
            return response()->json(['error' => 'Usuario no encontrado'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name'  => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:users,email,' . $id . ',_id',
            'phone' => 'nullable|string',
            'profile_photo' => 'nullable|image|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        if ($request->filled('phone') && ! $this->isValidPhone($request->phone)) {
            return response()->json(['error' => 'El teléfono debe incluir código de país válido'], 422);
        }

        $data = $request->only(['name', 'email', 'phone']);

        if ($request->hasFile('profile_photo')) {
            if ($user->profile_photo) {
                Storage::disk('public')->delete($user->profile_photo);
            }
            $data['profile_photo'] = $request->file('profile_photo')->store('profiles', 'public');
        }

        $user->update($data);

        return response()->json($user);
    }

    public function destroy(string $id)
    {
        $user = User::find($id);

        if (! $user) {
            return response()->json(['error' => 'Usuario no encontrado'], 404);
        }

        if ($user->profile_photo) {
            Storage::disk('public')->delete($user->profile_photo);
        }

        $user->delete();

        return response()->json(['message' => 'Usuario eliminado correctamente']);
    }

    private function isValidPhone(string $phone): bool
    {
        try {
            $phoneUtil = PhoneNumberUtil::getInstance();
            $parsed = $phoneUtil->parse($phone, null);
            return $phoneUtil->isValidNumber($parsed);
        } catch (\Exception $e) {
            return false;
        }
    }
    public function exportPdf()
    {
        $users = User::orderBy('created_at', 'desc')->get();

        $pdf = Pdf::loadView('exports.users-pdf', compact('users'));

        return $pdf->download('usuarios.pdf');
    }

    public function exportExcel()
    {
        return Excel::download(new UsersExport(), 'usuarios.xlsx');
    }
}
