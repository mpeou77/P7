import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isAuth$ = new BehaviorSubject<boolean>(false);
  private authToken = '';
  private userId = '';
  users: User[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  createUser(
    email: string,
    password: string,
    lastname: string,
    firstname: string
  ) {
    return this.http.post<{ message: string }>(
      'http://localhost:3000/api/signup',
      {
        email: email,
        password: password,
        lastname: lastname,
        firstname: firstname,
      }
    );
  }

  getToken(): string {
    return this.authToken;
  }

  getUserId(): string {
    return this.userId;
  }

  getUsereById(usertId: string): Observable <User> {
        
    return this.http.get<User>(`http://localhost:3000/api/users/${this.userId}`)

}

  getAllUsers(): Observable <User[]> {
    return this.http.get<User[]>('http://localhost:3000/api/signup');
}


  loginUser(email: string, password: string) {
    return this.http
      .post<{ userId: string; token: string; admin:any }>(
        'http://localhost:3000/api/login',
        { email: email, password: password }
      )
      .pipe(
        tap(({ userId, token, admin }) => {
          this.userId = userId;
          this.authToken = token;
          localStorage.setItem('userId', userId);
          localStorage.setItem('token', token);
          localStorage.setItem('admin', admin);
          this.isAuth$.next(true);
        })
      );
  }

  logout() {
    this.authToken = '';
    this.userId = '';
    this.isAuth$.next(false);
    localStorage.clear();
    this.router.navigate(['login']);
  }
}
