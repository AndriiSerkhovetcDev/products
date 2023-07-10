import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { catchError, map, Observable, throwError } from "rxjs";
import { Api } from "../../enums/api";
import { IProductPayload, IProductResponse } from "../../interfaces/product";
import { REST_API } from "../../consts/consts";

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  httpHeaders = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private httpClient: HttpClient) { }

  public addProduct(product: FormData): Observable<object> {
    return this.httpClient
      .post<IProductPayload>(`${ REST_API }/${ Api.addProduct }`, product)
      .pipe(catchError(this.handleError))
  }

  public getProducts(): Observable<IProductResponse[]> {
    return this.httpClient.get<IProductResponse[]>(`${ REST_API }/${ Api.getProducts }`);
  }

  public getProductById(id: string): Observable<IProductResponse> {
    let API_URL = `${ REST_API }/${ Api.getProducts }/${ id }`;

    return this.httpClient
      .get<IProductResponse>(API_URL, { headers: this.httpHeaders }).pipe(
        map((res: IProductResponse) => {
          return res || {};
        }),
      catchError(this.handleError))
  }

  public updateProduct(id: string, product: FormData): Observable<IProductPayload> {
    let API_URL = `${ REST_API }/${Api.updateProduct}/${ id }`;

    return this.httpClient
      .put<IProductPayload>(API_URL, product)
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
    if (error?.error instanceof ErrorEvent) {
      // Handle client error
      errorMessage = error.error.message;
    } else {
      // Handle server error
      errorMessage = `Error Code: ${error?.status}\nMessage: ${error?.message}`;
    }
    return throwError(() => {
      errorMessage;
    });
  }
}
