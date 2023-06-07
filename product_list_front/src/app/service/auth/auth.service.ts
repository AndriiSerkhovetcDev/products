import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { REST_API } from "../../const/rest-api";
import { Api } from "../../enum/api";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { TokenInterface } from "../../interfaces/token";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router) { }

  public registerUser(user: FormData): Observable<any> {
    const REGISTER_URL = `${ REST_API }/${ Api.registerUser }`;

    return this.http.post(REGISTER_URL, user);
  }

  public loginUser(user: FormData): Observable<any> {
    const LOGIN_URL = `${ REST_API }/${ Api.loginUser }`;

    return this.http.post(LOGIN_URL, user);
  }

  public removeUserCredentials() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  public checkUserCredentials() {
    return !!localStorage.getItem('token');
  }

  public getToken() {
    return localStorage.getItem('token');
  }
}
