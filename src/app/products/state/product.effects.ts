import { Injectable } from '@angular/core';

import { mergeMap, map, catchError, concatMap } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';

import { ProductService } from '../product.service';
import { Product } from '../product';
import * as productActions from './product.actions';


@Injectable()
export class ProductEffects {

    constructor(
        private actions$: Actions,
        private productService: ProductService) { }

    @Effect()
    loadProduct$: Observable<Action> = this.actions$.pipe(
        ofType(productActions.ProductActionTypes.Load),
        mergeMap((action: productActions.Load) => this.productService.getProducts().pipe(
            map((products: Product[]) => (new productActions.LoadSuccess(products))),
            catchError(err => of(new productActions.LoadFail(err)))
        ))
    );

    @Effect()
    updateProduct$: Observable<Action> = this.actions$.pipe(
        ofType(productActions.ProductActionTypes.UpdateProduct),
        map((action: productActions.UpdateProduct) => action.payload),
        concatMap((product: Product) => this.productService.updateProduct(product).pipe(
            map((updatedProduct: Product) => (new productActions.UpdateProductSuccess(updatedProduct))),
            catchError(err => of(new productActions.UpdateProductFail(err)))
        ))
    );

    @Effect()
    createProduct$: Observable<Action> = this.actions$.pipe(
        ofType(productActions.ProductActionTypes.CreateProduct),
        map( (action: productActions.CreateProduct) => action.payload),
        concatMap( (product: Product) => this.productService.createProduct(product).pipe(
            map( (newProduct: Product) => (new productActions.CreateProductSuccess(newProduct))),
            catchError( err => of(new productActions.UpdateProductFail(err)))
        ))
    );

    @Effect()
    deleteProduct$: Observable<Action> = this.actions$.pipe(
        ofType(productActions.ProductActionTypes.DeleteProduct),
        map( (action: productActions.DeleteProduct) => action.payload),
        concatMap( (product: Product) => this.productService.deleteProduct(product).pipe(
            map( () => (new productActions.DeleteProductSuccess(product))),
            catchError( err => of(new productActions.UpdateProductFail(err)))
        ))
    );
}
