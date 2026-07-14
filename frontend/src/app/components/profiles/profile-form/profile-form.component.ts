import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProfileService } from '../../../services/profile.service';
import { SectionService } from '../../../services/section.service';
import { Section } from '../../../models/section.model';

@Component({
  selector: 'app-profile-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './profile-form.component.html',
  styleUrl: './profile-form.component.scss',
})
export class ProfileFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private profileService = inject(ProfileService);
  private sectionService = inject(SectionService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  loading = false;
  isEditMode = false;
  profileId: string | null = null;
  sections: Section[] = [];

  profileForm = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(255)]],
    section_ids: [[] as string[]],
  });

  ngOnInit(): void {
    this.profileId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.profileId;

    this.sectionService.getAll().subscribe({
      next: (sections) => (this.sections = sections),
      error: () => this.snackBar.open('No se pudieron cargar las secciones', 'Cerrar', { duration: 3000 }),
    });

    if (this.isEditMode && this.profileId) {
      this.loadProfile(this.profileId);
    }
  }

  loadProfile(id: string): void {
    this.profileService.getById(id).subscribe({
      next: (data) => {
        this.profileForm.patchValue({
          name: data.name,
          section_ids: data.sections?.map((s: Section) => s.id) ?? [],
        });
      },
      error: () => {
        this.snackBar.open('No se pudo cargar el perfil', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/profiles']);
      },
    });
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const formValue = this.profileForm.getRawValue();

    const payload = {
      name: formValue.name ?? '',
      section_ids: formValue.section_ids ?? [],
    };

    const request$ = this.isEditMode && this.profileId
      ? this.profileService.update(this.profileId, payload)
      : this.profileService.create(payload);

    request$.subscribe({
      next: () => {
        this.loading = false;
        this.snackBar.open(
          this.isEditMode ? 'Perfil actualizado' : 'Perfil creado',
          'Cerrar',
          { duration: 3000 }
        );
        this.router.navigate(['/profiles']);
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Ocurrió un error al guardar el perfil', 'Cerrar', { duration: 3000 });
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/profiles']);
  }

  get name() {
    return this.profileForm.get('name');
  }
}