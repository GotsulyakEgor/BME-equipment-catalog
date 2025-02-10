import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {environment} from "environment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _isLoggedIn: boolean = false;
  private _isAdmin: boolean = false;

  constructor(private router: Router, private http: HttpClient) {
    this.loadAuthState();
  }

  get isLoggedIn(): boolean {
    return this._isLoggedIn;
  }

  get isAdmin(): boolean {
    return this._isAdmin;
  }

  login(username: string, password: string) {
    this.http
      .post<any>(`${environment.apiEndpoint}/api/tutorials/login`, { username, password })
      .subscribe({
        next: (res) => {
          if (res.isAdmin) {
            this._isAdmin = true;
            localStorage.setItem('isAdmin', 'true');
          } else {
            this._isAdmin = false;
            localStorage.removeItem('isAdmin');
          }

          this._isLoggedIn = true;
          localStorage.setItem('isLoggedIn', 'true');
          this.router.navigate(['/tutorials']);
        },
        error: (err) => {
          console.error('Login failed:', err.error.message);
          alert('Невірний логін або пароль');
        },
      });
  }
  logout() {
    this._isAdmin = false;
    this._isLoggedIn = false;
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('isLoggedIn');
    this.router.navigate(['/sign-in']);
  }

  private loadAuthState() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const isAdmin = localStorage.getItem('isAdmin');

    this._isLoggedIn = isLoggedIn === 'true';
    this._isAdmin = isAdmin === 'true';
  }
}
