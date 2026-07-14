import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatListModule, MatChipsModule],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss',
})
export class UserDetailComponent implements OnInit {
  private userService = inject(UserService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  detail: any = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.userService.getById(id).subscribe({
        next: (data) => (this.detail = data),
        error: () => this.router.navigate(['/users']),
      });
    }
  }

  get photoUrl(): string | null {
    return this.detail?.profile_photo
      ? `http://localhost:8000/storage/${this.detail.profile_photo}`
      : null;
  }

  back(): void {
    this.router.navigate(['/users']);
  }
}