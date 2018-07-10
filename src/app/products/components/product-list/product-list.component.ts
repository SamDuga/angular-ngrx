import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Product } from 'src/app/products/product';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent {
  pageTitle = 'Products';

  @Input() errorMessage: string;
  @Input() displayCode: boolean;
  @Input() products: Product[];
  @Input() selectedProduct: Product;

  @Output() checked = new EventEmitter<boolean>();
  @Output() initializeProduct = new EventEmitter<void>();
  @Output() selected = new EventEmitter<Product>();

  checkChanged(value: boolean): void {
    this.checked.emit(value);
  }

  newProduct(): void {
    this.initializeProduct.emit();
  }

  productSelected(product: Product): void {
    this.selected.emit(product);
  }
}
