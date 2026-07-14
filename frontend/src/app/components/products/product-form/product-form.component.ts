import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss',
})
export class ProductFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  loading = false;
  isEditMode = false;
  productId: string | null = null;

  productForm = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(255)]],
    brand: ['', [Validators.required, Validators.maxLength(255)]],
    price: [null as number | null, [Validators.required, Validators.min(0), Validators.max(999)]],
  });

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.productId;

    if (this.isEditMode && this.productId) {
      this.loadProduct(this.productId);
    }
  }

  loadProduct(id: string): void {
    this.productService.getById(id).subscribe({
      next: (product) => {
        this.productForm.patchValue({
          name: product.name,
          brand: product.brand,
          price: product.price,
        });
      },
      error: () => {
        this.snackBar.open('No se pudo cargar el producto', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/products']);
      },
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const formValue = this.productForm.getRawValue();

    const payload: Partial<Product> = {
      name: formValue.name ?? '',
      brand: formValue.brand ?? '',
      price: formValue.price ?? 0,
    };

    const request$ = this.isEditMode && this.productId
      ? this.productService.update(this.productId, payload)
      : this.productService.create(payload);

    request$.subscribe({
      next: () => {
        this.loading = false;
        this.snackBar.open(
          this.isEditMode ? 'Producto actualizado' : 'Producto creado',
          'Cerrar',
          { duration: 3000 }
        );
        this.router.navigate(['/products']);
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Ocurrió un error al guardar el producto', 'Cerrar', { duration: 3000 });
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/products']);
  }

  get name() {
    return this.productForm.get('name');
  }

  get brand() {
    return this.productForm.get('brand');
  }

  get price() {
    return this.productForm.get('price');
  }
}