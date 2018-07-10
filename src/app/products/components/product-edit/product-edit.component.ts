import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { takeWhile } from 'rxjs/operators';

import { Product } from '../../product';
import { GenericValidator } from '../../../shared/generic-validator';
import { NumberValidators } from '../../../shared/number.validator';

import { Store, select } from '@ngrx/store';
import * as fromProduct from '../../state/';
import * as productActions from '../../state/product.actions';
import { ChangeDetectorStatus } from '../../../../../node_modules/@angular/core/src/change_detection/constants';

@Component({
  selector: 'pm-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit, OnDestroy, OnChanges {
  pageTitle = 'Product Edit';
  productForm: FormGroup;
  componentActive = true;

  @Input() errorMessage: string;
  @Input() selectedProduct: Product | null;

  @Output() create = new EventEmitter<Product>();
  @Output() update = new EventEmitter<Product>();
  @Output() delete = new EventEmitter<Product>();
  @Output() clearCurrent = new EventEmitter<void>();

  // Use with the generic validation message class
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  constructor(
    private fb: FormBuilder) {

    // Defines all of the validation messages for the form.
    // These could instead be retrieved from a file or database.
    this.validationMessages = {
      productName: {
        required: 'Product name is required.',
        minlength: 'Product name must be at least three characters.',
        maxlength: 'Product name cannot exceed 50 characters.'
      },
      productCode: {
        required: 'Product code is required.'
      },
      starRating: {
        range: 'Rate the product between 1 (lowest) and 5 (highest).'
      }
    };

    // Define an instance of the validator for use with this form,
    // passing in this form's set of validation messages.
    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit(): void {
    // Define the form group
    this.productForm = this.fb.group({
      productName: ['', [Validators.required,
                         Validators.minLength(3),
                         Validators.maxLength(50)]],
      productCode: ['', Validators.required],
      starRating: ['', NumberValidators.range(1, 5)],
      description: ''
    });

    // Watch for value changes
    this.productForm.valueChanges.subscribe(
      value => this.displayMessage = this.genericValidator.processMessages(this.productForm)
    );
  }

  ngOnDestroy(): void {
    this.componentActive = false;
  }

  ngOnChanges(changes: SimpleChanges): void {

    // Watch for changes to the currently selected product
    if (changes.selectedProduct) {
      const product: Product = changes.selectedProduct.currentValue as Product;
      this.displayProduct(product);
    }

  }

  // Also validate on blur
  // Helpful if the user tabs through required fields
  blur(): void {
    this.displayMessage = this.genericValidator.processMessages(this.productForm);
  }

  displayProduct(product: Product | null): void {
    // Set the local product property
    this.selectedProduct = product;

    if (this.selectedProduct) {
      // Reset the form back to pristine
      this.productForm.reset();

      // Display the appropriate page title
      if (this.selectedProduct.id === 0)
        this.pageTitle = 'Add Product';
      else
        this.pageTitle = `Edit Product: ${this.selectedProduct.productName}`;

      // Update the data on the form
      this.productForm.patchValue({
        productName: this.selectedProduct.productName,
        productCode: this.selectedProduct.productCode,
        starRating: this.selectedProduct.starRating,
        description: this.selectedProduct.description
      });
    }
  }

  cancelEdit(): void {
    // Redisplay the currently selected product
    // replacing any edits made
    this.displayProduct(this.selectedProduct);
  }

  deleteProduct(): void {
    if (this.selectedProduct && this.selectedProduct.id) {
      if (confirm(`Really delete the product: ${this.selectedProduct.productName}?`))
        this.delete.emit(this.selectedProduct);
    } else
      // No need to delete, it was never saved
      this.clearCurrent.emit();
  }

  saveProduct(): void {
    if (this.productForm.valid) {
      if (this.productForm.dirty) {
        // Copy over all of the original product properties
        // Then copy over the values from the form
        // This ensures values not on the form, such as the Id, are retained
        const p = { ...this.selectedProduct, ...this.productForm.value };

        if (p.id === 0)
          this.create.emit(p);
        else
          this.update.emit(p);
      }
    } else this.errorMessage = 'Please correct the validation errors.';
  }

}
