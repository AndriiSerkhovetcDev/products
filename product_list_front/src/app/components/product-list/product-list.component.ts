import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { ProductService } from "../../service/product/product.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ProductCardComponent } from "../product-card/product-card.component";
import {ProductPayload, ProductResponse} from "../../interfaces/product";
@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  providers: [ProductService],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  public products = signal<ProductResponse[]>([]);

  constructor(private productService: ProductService) {
   this.getProducts()
  }
  ngOnInit() {}

  private getProducts(): void {
    this.productService.getProducts()
      .pipe(takeUntilDestroyed())
      .subscribe((products: ProductResponse[]) => {
        this.products.set(products)
      });
  }
  public onRemoveProduct(index: number): void {
    this.products.mutate( (value: ProductResponse[]) => value.splice(index, 1))
  }
}
