<?php

namespace App\Http\Controllers;

use App\Models\Profile;
use App\Models\Section;
use App\Models\Counter;
use App\Exports\ProfilesExport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Maatwebsite\Excel\Facades\Excel;
use Barryvdh\DomPDF\Facade\Pdf;

class ProfileController extends Controller
{
    public function index()
    {
        return response()->json(Profile::orderBy('created_at', 'desc')->get());
    }

    public function show(string $id)
    {
        $profile = Profile::find($id);

        if (! $profile) {
            return response()->json(['error' => 'Perfil no encontrado'], 404);
        }

        $sections = Section::whereIn('_id', $profile->section_ids ?? [])->get();

        return response()->json([
            'code' => $profile->code,
            'name' => $profile->name,
            'created_at' => $profile->created_at,
            'sections' => $sections,
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'section_ids' => 'sometimes|array',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $sequence = Counter::next('profiles');
        $code = 'PROF-' . str_pad($sequence, 4, '0', STR_PAD_LEFT);

        $profile = Profile::create([
            'code' => $code,
            'name' => $request->name,
            'section_ids' => $request->section_ids ?? [],
        ]);

        return response()->json($profile, 201);
    }

    public function update(Request $request, string $id)
    {
        $profile = Profile::find($id);

        if (! $profile) {
            return response()->json(['error' => 'Perfil no encontrado'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'section_ids' => 'sometimes|array',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $profile->update($request->only(['name', 'section_ids']));

        return response()->json($profile);
    }

    public function destroy(string $id)
    {
        $profile = Profile::find($id);

        if (! $profile) {
            return response()->json(['error' => 'Perfil no encontrado'], 404);
        }

        $profile->delete();

        return response()->json(['message' => 'Perfil eliminado correctamente']);
    }
    public function exportPdf()
    {
        $profiles = Profile::orderBy('created_at', 'desc')->get();

        $pdf = Pdf::loadView('exports.profiles-pdf', compact('profiles'));

        return $pdf->download('perfiles.pdf');
    }

    public function exportExcel()
    {
        return Excel::download(new ProfilesExport(), 'perfiles.xlsx');
    }
}
