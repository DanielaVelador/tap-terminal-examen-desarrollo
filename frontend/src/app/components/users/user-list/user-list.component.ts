import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent implements OnInit {
  private userService = inject(UserService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  displayedColumns: string[] = ['code', 'email', 'name', 'created_at', 'actions'];
  dataSource = new MatTableDataSource<User>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAll().subscribe({
      next: (users) => {
        this.dataSource.data = users;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: () => this.snackBar.open('Error al cargar usuarios', 'Cerrar', { duration: 3000 }),
    });
  }

  create(): void {
    this.router.navigate(['/users/new']);
  }

  edit(id: string): void {
    this.router.navigate(['/users/edit', id]);
  }

  viewDetail(id: string): void {
    this.router.navigate(['/users/detail', id]);
  }

  delete(id: string): void {
    if (!confirm('¿Seguro que deseas eliminar este usuario?')) return;

    this.userService.delete(id).subscribe({
      next: () => {
        this.snackBar.open('Usuario eliminado', 'Cerrar', { duration: 3000 });
        this.loadUsers();
      },
      error: () => this.snackBar.open('Error al eliminar el usuario', 'Cerrar', { duration: 3000 }),
    });
  }

  exportPdf(): void {
    this.userService.exportPdf().subscribe((blob) => this.downloadFile(blob, 'usuarios.pdf'));
  }

  exportExcel(): void {
    this.userService.exportExcel().subscribe((blob) => this.downloadFile(blob, 'usuarios.xlsx'));
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