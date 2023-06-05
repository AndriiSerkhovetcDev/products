import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import { Router } from "@angular/router";
import { ProductService } from "../../service/product/product.service";
import { FormValidationService } from "../../service/form-validation/form-validation.service";

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [ProductService, FormValidationService],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent {
  public productForm: FormGroup
  private selectedFile: File | null = null;
  constructor(
    public formBuilder: FormBuilder,
    private route: Router,
    private productService: ProductService,
    private formValidationService: FormValidationService
    ) {
    this.productForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]], // Валідація на мінімальну довжину
      price: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]], // Валідація числового формату (до двох знаків після коми)
      description: ['', [Validators.required, Validators.maxLength(200)]], // Валідація на максимальну довжину
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
      .subscribe(() => {
        this.productForm.reset();
        this.route.navigate(['products'])
    }, (error) => this.productService.handleError(error) )
  }

  public isInvalid(controlName: string): boolean {
    return this.formValidationService.isInvalid(controlName, this.productForm);
  }

  public getErrorMessage(controlName: string): string {
    return this.formValidationService.getErrorMessage(controlName, this.productForm);
  }
}
