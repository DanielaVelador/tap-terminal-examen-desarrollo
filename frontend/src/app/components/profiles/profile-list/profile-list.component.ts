import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ProfileService } from '../../../services/profile.service';
import { Profile } from '../../../models/profile.model';

@Component({
  selector: 'app-profile-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './profile-list.component.html',
  styleUrl: './profile-list.component.scss',
})
export class ProfileListComponent implements OnInit {
  private profileService = inject(ProfileService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  displayedColumns: string[] = ['code', 'name', 'created_at', 'actions'];
  dataSource = new MatTableDataSource<Profile>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.loadProfiles();
  }

  loadProfiles(): void {
    this.profileService.getAll().subscribe({
      next: (profiles) => {
        this.dataSource.data = profiles;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: () => this.snackBar.open('Error al cargar perfiles', 'Cerrar', { duration: 3000 }),
    });
  }

  create(): void {
    this.router.navigate(['/profiles/new']);
  }

  edit(id: string): void {
    this.router.navigate(['/profiles/edit', id]);
  }

  viewDetail(id: string): void {
    this.router.navigate(['/profiles/detail', id]);
  }

  delete(id: string): void {
    if (!confirm('¿Seguro que deseas eliminar este perfil?')) return;

    this.profileService.delete(id).subscribe({
      next: () => {
        this.snackBar.open('Perfil eliminado', 'Cerrar', { duration: 3000 });
        this.loadProfiles();
      },
      error: () => this.snackBar.open('Error al eliminar el perfil', 'Cerrar', { duration: 3000 }),
    });
  }

  exportPdf(): void {
    this.profileService.exportPdf().subscribe((blob) => this.downloadFile(blob, 'perfiles.pdf'));
  }

  exportExcel(): void {
    this.profileService.exportExcel().subscribe((blob) => this.downloadFile(blob, 'perfiles.xlsx'));
  }

  private downloadFile(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}