<?php

namespace App\Exports;

use App\Models\Profile;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class ProfilesExport implements FromCollection, WithHeadings, WithMapping
{
    public function collection()
    {
        return Profile::orderBy('created_at', 'desc')->get();
    }

    public function headings(): array
    {
        return ['Código', 'Nombre', 'Fecha de creación'];
    }

    public function map($profile): array
    {
        return [
            $profile->code,
            $profile->name,
            $profile->created_at->format('d/m/Y H:i'),
        ];
    }
}
