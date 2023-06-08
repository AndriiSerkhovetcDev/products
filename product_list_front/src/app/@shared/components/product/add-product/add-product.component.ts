import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import { Router } from "@angular/router";
import { ProductService } from "../../../../@core/services/product/product.service";
import { FormValidationService } from "../../../../@core/services/form-validation/form-validation.service";
import { ToastrService } from "ngx-toastr";
import { Subject, takeUntil } from "rxjs";
import { ProductSuccessMessage } from "../../../../@core/enums/product";

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [ProductService, FormValidationService],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnDestroy {
  public productForm: FormGroup
  private selectedFile: File | null = null;
  private destroy$ = new Subject();
  constructor(
    public formBuilder: FormBuilder,
    private route: Router,
    private productService: ProductService,
    private formValidationService: FormValidationService,
    private toastr: ToastrService)
  {
    this.productForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      price: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      description: ['', [Validators.required, Validators.maxLength(200)]],
      image: ['', [Validators.required, this.formValidationService.fileExtension()]]
    })
  }
  public onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];

    if (file) {
      this.selectedFile = file;
    }
  }
  public onSubmit(): void {
    if (this.productForm.invalid) {
      return;
    }

    const formData = new FormData();
    formData.append('name', this.productForm.value.name);
    formData.append('price', this.productForm.value.price);
    formData.append('description', this.productForm.value.description);

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.productService.addProduct(formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.toastr.success(ProductSuccessMessage.addedProduct)
        this.productForm.reset();
        this.route.navigate(['products'])
    })
  }

  public isInvalid(controlName: string): boolean {
    return this.formValidationService.isInvalid(controlName, this.productForm);
  }

  public getErrorMessage(controlName: string): string {
    return this.formValidationService.getErrorMessage(controlName, this.productForm);
  }

  ngOnDestroy() {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
