import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { Observable } from 'rxjs';

import { Store, select } from '@ngrx/store';
import { Product } from '../../product';
import * as fromProduct from './../../state';
import * as productActions from './../../state/product.actions';

@Component({
    template:
        `
    <div class='row'>
        <div class='col-md-4'>
            <pm-product-list
                [errorMessage]='errorMessage$ | async'
                [displayCode]='displayCode$ | async'
                [products]='products$ | async'
                [selectedProduct]='selectedProduct$ | async'
                (checked)='checkChanged($event)'
                (initializeNewProduct)='newProduct()'
                (selected)='productSelected($event)'
            ></pm-product-list>
        </div>
        <div class='col-md-8'>
            <pm-product-edit
                [errorMessage]='errorMessage$ | async'
                [selectedProduct]='selectedProduct$ | async'
                (delete)='deleteProduct($event)'
                (update)='updateProduct($event)'
                (create)='saveProduct($event)'
                (clearCurrent)='clearProduct()'
            ></pm-product-edit>
        </div>
    </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductShellComponent implements OnInit {
    displayCode$: Observable<boolean>;
    selectedProduct$: Observable<Product>;
    products$: Observable<Product[]>;
    errorMessage$: Observable<string>;

    constructor(private store: Store<fromProduct.State>) { }

    ngOnInit(): void {
        this.store.dispatch(new productActions.Load());
        this.products$ = this.store.pipe(select(fromProduct.getProducts));
        this.errorMessage$ = this.store.pipe(select(fromProduct.getError));
        this.selectedProduct$ = this.store.pipe(select(fromProduct.getCurrentProduct));
        this.displayCode$ = this.store.pipe(select(fromProduct.getShowProductCode));
    }

    checkChanged(value: boolean): void {
        this.store.dispatch(new productActions.ToggleProductCode(value));
    }

    newProduct(): void {
        this.store.dispatch(new productActions.InitializeCurrentProduct());
    }

    productSelected(product: Product): void {
        this.store.dispatch(new productActions.SetCurrentProduct(product));
    }

    deleteProduct(product: Product): void {
        this.store.dispatch(new productActions.DeleteProduct(product));
    }

    clearProduct(): void {
        this.store.dispatch(new productActions.ClearCurrentProduct());
    }
    saveProduct(product: Product): void {
        this.store.dispatch(new productActions.CreateProduct(product));
    }

    updateProduct(product: Product): void {
        this.store.dispatch(new productActions.UpdateProduct(product));
    }
}
