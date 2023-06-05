import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from "../../service/product/product.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent {
  @Input() name = '';
  @Input() price = '';
  @Input() description = '';
  @Input() imgUrl = '';
  @Input() id = ''
  @Input() elementIndex: number = 0;
  @Output() removeClick: EventEmitter<number> = new EventEmitter<number>();

  constructor(private productService: ProductService, private route: Router) {}

  public onRemoveProduct(id: string, index: number): void {
    this.productService.deleteProduct(id).subscribe(() => {
      this.removeClick.emit(index)
    });
  }
  public onProductDetails(productId: string): void {
    this.route.navigate([`edit/${ productId }`], { state : { id: productId } })
  }
}
