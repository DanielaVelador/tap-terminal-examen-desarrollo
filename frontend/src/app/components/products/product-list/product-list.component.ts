import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  displayedColumns: string[] = ['code', 'name', 'brand', 'price', 'created_at', 'actions'];
  dataSource = new MatTableDataSource<Product>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getAll().subscribe({
      next: (products) => {
        this.dataSource.data = products;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: () => this.snackBar.open('Error al cargar productos', 'Cerrar', { duration: 3000 }),
    });
  }

  create(): void {
    this.router.navigate(['/products/new']);
  }

  edit(id: string): void {
    this.router.navigate(['/products/edit', id]);
  }

  delete(id: string): void {
    if (!confirm('¿Seguro que deseas eliminar este producto?')) return;

    this.productService.delete(id).subscribe({
      next: () => {
        this.snackBar.open('Producto eliminado', 'Cerrar', { duration: 3000 });
        this.loadProducts();
      },
      error: () => this.snackBar.open('Error al eliminar el producto', 'Cerrar', { duration: 3000 }),
    });
  }

  exportPdf(): void {
    this.productService.exportPdf().subscribe((blob) => this.downloadFile(blob, 'productos.pdf'));
  }

  exportExcel(): void {
    this.productService.exportExcel().subscribe((blob) => this.downloadFile(blob, 'productos.xlsx'));
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