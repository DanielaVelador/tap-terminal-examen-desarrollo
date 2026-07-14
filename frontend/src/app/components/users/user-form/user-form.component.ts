import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss',
})
export class UserFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  loading = false;
  isEditMode = false;
  userId: string | null = null;
  selectedFile: File | null = null;
  currentPhotoUrl: string | null = null;

  userForm = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(255)]],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
  });

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.userId;

    if (this.isEditMode && this.userId) {
      this.loadUser(this.userId);
    }
  }

  loadUser(id: string): void {
    this.userService.getById(id).subscribe({
      next: (data) => {
        this.userForm.patchValue({
          name: data.user,
          email: data.email,
          phone: data.phone,
        });
        this.currentPhotoUrl = data.profile_photo
          ? `http://localhost:8000/storage/${data.profile_photo}`
          : null;
      },
      error: () => {
        this.snackBar.open('No se pudo cargar el usuario', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/users']);
      },
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    if (!this.isEditMode && !this.selectedFile) {
      this.snackBar.open('La foto de perfil es requerida', 'Cerrar', { duration: 3000 });
      return;
    }

    this.loading = true;
    const formValue = this.userForm.getRawValue();

    const formData = new FormData();
    formData.append('name', formValue.name ?? '');
    formData.append('email', formValue.email ?? '');
    if (formValue.phone) {
      formData.append('phone', formValue.phone);
    }
    if (this.selectedFile) {
      formData.append('profile_photo', this.selectedFile);
    }

    const request$ = this.isEditMode && this.userId
      ? this.userService.update(this.userId, formData)
      : this.userService.create(formData);

    request$.subscribe({
      next: () => {
        this.loading = false;
        this.snackBar.open(
          this.isEditMode ? 'Usuario actualizado' : 'Usuario creado',
          'Cerrar',
          { duration: 3000 }
        );
        this.router.navigate(['/users']);
      },
      error: (err) => {
        this.loading = false;
        const message = err.error?.email
          ? 'Ese correo ya está en uso'
          : err.error?.error || 'Ocurrió un error al guardar el usuario';
        this.snackBar.open(message, 'Cerrar', { duration: 4000 });
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/users']);
  }

  get name() {
    return this.userForm.get('name');
  }

  get email() {
    return this.userForm.get('email');
  }
}