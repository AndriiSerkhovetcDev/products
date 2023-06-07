import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { catchError, map, Observable, throwError } from "rxjs";
import { REST_API } from "../../const/rest-api";
import { Api } from "../../enum/api";
import { ProductResponse } from "../../interfaces/product";

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  httpHeaders = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private httpClient: HttpClient) { }

  public addProduct(product: any) {
    let API_URL = `${ REST_API }/${ Api.addProduct }`;

    return this.httpClient
      .post(API_URL, product)
      .pipe(catchError(this.handleError))
  }

  public getProducts(): Observable<any> {
    return this.httpClient.get(`${ REST_API }/${Api.getProducts}`);
  }

  public getProductById(id: string): Observable<ProductResponse> {
    let API_URL = `${ REST_API }/${ Api.getProducts }/${ id }`;

    return this.httpClient
      .get(API_URL, { headers: this.httpHeaders }).pipe(
        map((res: any) => {
          return res || {};
        }),
      catchError(this.handleError))
  }

  public updateProduct(id: string, product: FormData) {
    let API_URL = `${ REST_API }/${Api.updateProduct}/${ id }`;

    return this.httpClient
      .put(API_URL, product)
      .pipe(catchError(this.handleError));
  }

  public deleteProduct(id: string) {
    let API_URL = `${ REST_API }/${ Api.deleteProduct }/${ id }`;

    return this.httpClient
      .delete(API_URL,{ headers: this.httpHeaders })
      .pipe(catchError(this.handleError));
  }

  public handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Handle client error
      errorMessage = error.error.message;
    } else {
      // Handle server error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    return throwError(() => {
      errorMessage;
    });
  }
}
