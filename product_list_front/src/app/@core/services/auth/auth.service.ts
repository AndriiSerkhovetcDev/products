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
    return this.http.post<IAuthResponse>(Api.registerUser, user);
  }

  public loginUser(user: User): Observable<IAuthResponse> {
    return this.http.post<IAuthResponse>(Api.loginUser, user);
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
