import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import { Router } from "@angular/router";
import { ProductService } from "../../service/product/product.service";

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
      name: ['', Validators.required],
      price: ['', Validators.required],
      description: ['', Validators.required]
    })
  }

  public onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
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

  public isInvalid(fieldName: string): boolean {
    return this.productForm.controls[`${ fieldName }`].invalid && this.productForm.controls[`${ fieldName }`].touched
  }
}
