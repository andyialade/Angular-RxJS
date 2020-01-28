import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { Observable, EMPTY, Subject, combineLatest } from 'rxjs';

import { Product } from './product';
import { ProductService } from './product.service';
import { catchError, map, startWith } from 'rxjs/operators';
import { ProductCategoryService } from '../product-categories/product-category.service';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent {
  pageTitle = 'Product List';
  errorMessage = '';

  private categorySelectedSubject = new Subject<number>();
  categorySelectedAction$ = this.categorySelectedSubject.asObservable();
  // selectedCategoryId = 1;

  // products: Product[] = [];

  products$ = combineLatest([
    // this.productService.productsWithCategory$,
    this.productService.productsWithAdd$,
    this.categorySelectedAction$.pipe( startWith(0)) ])
    .pipe(
      map(([products, selectedCategoryId]) =>
        products.filter(product =>
          selectedCategoryId ? product.categoryId === selectedCategoryId : true
      )),
      catchError(err => {
        this.errorMessage = err;
        return EMPTY; })
    );

  // OLD Products stream without filter
  // products$ = this.productService.productsWithCategory$
  //   .pipe(
  //     catchError(err => {
  //       this.errorMessage = err;
  //       return EMPTY; })
  //   );

    categories$ = this.productCategoryService.productCategories$
    .pipe(
      catchError(err => {
        this.errorMessage = err;
        return EMPTY; })
    );

    // productsSimpleFilter$ = this.productService.productsWithCategory$
    // .pipe(
    //   map(products => products.filter(
    //     product => this.selectedCategoryId ? product.categoryId === this.selectedCategoryId : true
    //   ))
    // );
  // sub: Subscription;

  constructor(private productService: ProductService,
              private productCategoryService: ProductCategoryService) { }

  // ngOnInit(): void {
  //   this.products$ = this.productService.getProducts()
  //       .pipe(
  //         catchError(err => {
  //           this.errorMessage = err;
  //           return EMPTY; })
  //       );

  //   this.sub = this.productService.getProducts()
  //     .subscribe(
  //       products => this.products = products,
  //       error => this.errorMessage = error
  //     );
  // }

  // ngOnDestroy(): void {
  //   this.sub.unsubscribe();
  // }

  onAdd(): void {
    this.productService.addProduct();
  }

  onSelected(categoryId: string): void {
    // this.selectedCategoryId = +categoryId;

    this.categorySelectedSubject.next(+categoryId);
  }
}
