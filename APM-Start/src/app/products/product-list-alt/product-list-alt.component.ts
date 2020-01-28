import { Component, ChangeDetectionStrategy } from '@angular/core';

import { EMPTY, Subject } from 'rxjs';

import { ProductService } from '../product.service';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list-alt.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListAltComponent  {
  pageTitle = 'Products';
  //errorMessage = '';
  //selectedProductId;

  // products: Product[] = [];
  // sub: Subscription;
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  products$ = this.productService.products$
  .pipe(
    catchError(err => {
      this.errorMessageSubject.next(err);
      return EMPTY; })
  );

  selectedProduct$ = this.productService.selectedProduct$;

  constructor(private productService: ProductService) { }

  // ngOnInit(): void {
  //   this.sub = this.productService.getProducts().subscribe(
  //     products => this.products = products,
  //     error => this.errorMessage = error
  //   );
  // }

  // ngOnDestroy(): void {
  //   this.sub.unsubscribe();
  // }

  onSelected(productId: number): void {
    this.productService.selectedProductChanged(productId);
  }
}
