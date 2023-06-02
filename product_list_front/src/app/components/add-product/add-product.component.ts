import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import { Router } from "@angular/router";
import { ProductService } from "../../service/product/product.service";
import {Erorrs, ErrorType} from "../../enum/erorrs";

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [ProductService],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent {
  public productForm: FormGroup
  private selectedFile: File | null = null;
  constructor(
    public formBuilder: FormBuilder,
    private route: Router,
    private productService: ProductService
    ) {
    this.productForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]], // Валідація на мінімальну довжину
      price: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]], // Валідація числового формату (до двох знаків після коми)
      description: ['', [Validators.required, Validators.maxLength(200)]], // Валідація на максимальну довжину
      image: ['', [Validators.required, this.fileExtension(['jpg', 'jpeg', 'png'])]]
    })
  }
  public onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];

    if (file) {
      this.selectedFile = file;
    }
  }
  public onSubmit() {
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

  public isInvalid(controlName: string) {
    const control = this.productForm.get(controlName);

    return control !== null && control.invalid && (control.dirty || control.touched);
  }

  public fileExtension(allowedExtensions: string[]) {
    return (control: AbstractControl) => {
      const file = control.value;
      if (file) {
        const extension = file.split('.').pop().toLowerCase();
        if (!allowedExtensions.includes(extension)) {
          return { invalidExtension: true };
        }
      }
      return null;
    };
  }

  public getErrorMessage(controlName: string): string {
    const control = this.productForm.get(controlName);
    const errors = control?.errors;

    if (!errors) {
      return '';
    }

    switch (true) {
      case !!errors[ErrorType.required]:
        return Erorrs.required;
      case !!errors[ErrorType.invalidExtension]:
        return Erorrs.invalidFileFormat;
      case !!errors[ErrorType.pattern] && controlName === 'price':
        return Erorrs.pattern
      case !!errors[ErrorType.minlength]:
        return Erorrs.minLength;
      default:
        return '';
    }
  }

}
