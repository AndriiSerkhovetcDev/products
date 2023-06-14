import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from "../../../../@core/services/product/product.service";
import { Router } from "@angular/router";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { FormValidationService } from "../../../../@core/services/form-validation/form-validation.service";
import { IProductResponse } from "../../../../@core/interfaces/product";
import { ToastrService } from "ngx-toastr";
import {Subject, takeUntil} from "rxjs";
import { ProductSuccessMessage } from "../../../../@core/enums/product";

@Component({
  selector: 'app-product-update',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  providers: [ProductService, FormValidationService],
  templateUrl: './product-update.component.html',
  styleUrls: ['./product-update.component.scss']
})
export class ProductUpdateComponent implements OnDestroy {
  private readonly id: string = '';
  private selectedFile: File | null = null;
  private selectedImagePath: string = '';
  private destroy$ = new Subject();
  public editForm: FormGroup;
  constructor(
    private productService: ProductService,
    private router: Router,
    private formValidationService: FormValidationService,
    public formBuilder: FormBuilder,
    private toastr: ToastrService) {

    this.id = (this.router.getCurrentNavigation()?.extras?.state?.id as string) || '';
    this.editForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      price: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      description: ['', [Validators.required, Validators.maxLength(200)]],
      image: ['', [this.formValidationService.fileExtension()]]
    })

    if (this.id) {
      this.getProductById(this.id);
    }
  }

  private getProductById(id: string) {
    return this.productService.getProductById(id)
      .pipe(takeUntilDestroyed())
      .subscribe((product: IProductResponse) => {
        this.editForm.setValue({
          name: product?.name,
          price: product?.price,
          description: product?.description,
          image: null
        })

        this.selectedImagePath = product.imagePath;
      });
  }

  public isInvalid(controlName: string): boolean {
    return this.formValidationService.isInvalid(controlName, this.editForm);
  }

  public getErrorMessage(controlName: string): string {
    return this.formValidationService.getErrorMessage(controlName, this.editForm);
  }

  public onSubmit(): void {

    if (this.editForm.invalid) {
      return;
    }

    const formData = new FormData();
    formData.append('name', this.editForm.value.name);
    formData.append('price', this.editForm.value.price);
    formData.append('description', this.editForm.value.description);
    formData.append('image', this.selectedFile ? this.selectedFile : this.selectedImagePath);

    this.productService.updateProduct(this.id, formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.toastr.success(ProductSuccessMessage.updatedProduct);
        this.router.navigate(['products'])
      })
  }

  public onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];

    if (file) {
      this.selectedFile = file;
    }
  }

  ngOnDestroy() {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
