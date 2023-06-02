import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from "../../service/product/product.service";
import { Router } from "@angular/router";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { FormValidationService } from "../../service/form-validation/form-validation.service";
import {ProductPayload, ProductResponse} from "../../interfaces/product";

@Component({
  selector: 'app-product-update',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  providers: [ProductService, FormValidationService],
  templateUrl: './product-update.component.html',
  styleUrls: ['./product-update.component.scss']
})
export class ProductUpdateComponent {
  public product: any = signal<ProductResponse | null>(null)
  private readonly id = '';
  public editForm: FormGroup;
  private selectedFile: File | null = null;
  private selectedImagePath: string = '';
  constructor(
    private productService: ProductService,
    private router: Router,
    private formValidationService: FormValidationService,
    public formBuilder: FormBuilder) {

    // @ts-ignore
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
      .subscribe((product: ProductResponse) => {
        this.editForm.setValue({
          name: product?.name,
          price: product?.price,
          description: product?.description,
          image: null
        })

        this.selectedImagePath = product.imagePath;
        this.product.set(product);
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
      .subscribe(() => {
        this.router.navigate(['products'])
      }, (error) => this.productService.handleError(error))
  }

  public onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];

    if (file) {
      this.selectedFile = file;
    }
  }
}
