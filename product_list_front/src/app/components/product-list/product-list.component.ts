import { Component, Inject, OnInit, signal } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { ProductService } from "../../service/product/product.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ProductCardComponent } from "../product-card/product-card.component";
@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  providers: [ProductService],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  public products = signal<any[]>([]);

  constructor(private productService: ProductService) {
    this.productService.getProducts()
      .pipe(takeUntilDestroyed())
      .subscribe((products: any) => {
        this.products.set(products)
      });
  }
  ngOnInit() {
  }

  onRemoveProduct(index: number) {
    console.log(index)
    this.products.mutate( (value) => value.splice(index, 1))
  }
}
