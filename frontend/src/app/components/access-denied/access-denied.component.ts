import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-access-denied',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './access-denied.component.html',
  styleUrl: './access-denied.component.scss',
})
export class AccessDeniedComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  goHome(): void {
    const sections = this.authService.getSections();

    if (sections.length > 0) {
      this.router.navigate([`/${sections[0]}`]);
    } else {
      // El usuario no tiene ninguna sección asignada: no hay a dónde volver dentro de la app
      this.authService.clearToken();
      this.router.navigate(['/login']);
    }
  }
}