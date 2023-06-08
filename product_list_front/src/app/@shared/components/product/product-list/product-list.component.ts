import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from "../../../../@core/services/product/product.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ProductCardComponent } from "../product-card/product-card.component";
import { IProductResponse} from "../../../../@core/interfaces/product";
import { HttpClientModule } from "@angular/common/http";
import { Router } from "@angular/router";
@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, HttpClientModule],
  providers: [ProductService],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  public products = signal<IProductResponse[]>([]);

  constructor(private productService: ProductService, private route: Router) {
   this.getProducts()
  }
  ngOnInit() {}

  private getProducts(): void {
    this.productService.getProducts()
      .pipe(takeUntilDestroyed())
      .subscribe((products: IProductResponse[]) => {
        this.products.set(products)
      });
  }
  public onRemoveProduct(index: number): void {
    this.products.mutate( (value: IProductResponse[]) => value.splice(index, 1))
  }

  public trackByMethod(index: number, el: IProductResponse): string {
    return el._id;
  }

  onAddProduct() {
    this.route.navigate(['/add'])
  }
}
