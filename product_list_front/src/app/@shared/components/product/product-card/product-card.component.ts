import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from "../../../../@core/services/product/product.service";
import { Router } from "@angular/router";
import { Subject, takeUntil } from "rxjs";

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnDestroy {
  @Input() name = '';
  @Input() price = '';
  @Input() description = '';
  @Input() imgUrl = '';
  @Input() id = ''
  @Input() elementIndex: number = 0;
  @Output() removeClick: EventEmitter<number> = new EventEmitter<number>();
  private destroy$ = new Subject();
  constructor(private productService: ProductService, private route: Router) {}

  public onRemoveProduct(id: string, index: number): void {
    this.productService.deleteProduct(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
      this.removeClick.emit(index)
    });
  }
  public onProductDetails(productId: string): void {
    this.route.navigate([`edit/${ productId }`], { state : { id: productId } })
  }

  ngOnDestroy() {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
