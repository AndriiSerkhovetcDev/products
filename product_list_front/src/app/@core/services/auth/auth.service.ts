import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { REST_API } from "../../consts/rest-api";
import { Api } from "../../enums/api";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { IAuthResponse } from "../../interfaces/token";
import { User } from "../../interfaces/user";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router) { }

  public registerUser(user: User): Observable<IAuthResponse> {
    const REGISTER_URL = `${ REST_API }/${ Api.registerUser }`;

    return this.http.post<IAuthResponse>(REGISTER_URL, user);
  }

  public loginUser(user: User): Observable<IAuthResponse> {
    const LOGIN_URL = `${ REST_API }/${ Api.loginUser }`;

    return this.http.post<IAuthResponse>(LOGIN_URL, user);
  }

  public removeUserCredentials(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  public checkUserCredentials(): boolean {
    return !!localStorage.getItem('token');
  }

  public getToken(): string | null {
    return localStorage.getItem('token');
  }
}
