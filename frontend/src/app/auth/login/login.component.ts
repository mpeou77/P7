import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, EMPTY, switchMap, tap } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm!: FormGroup;
  errorMsg!: string;
  mailRegex!: RegExp;
  
  constructor(private auth: AuthService,
              private router: Router,
              private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.mailRegex = /^[a-zA-Z0-9.!#$%&’*+=?^_`{|}~-]+@groupomania\.com*$/;
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.pattern(this.mailRegex)]],
      password: [null, Validators.required],
      admin: [null,Validators.required]
    })
  }
  
  onLogin() {
    const email = this.loginForm.get('email')!.value;
    const password = this.loginForm.get('password')!.value;
    if (! this.mailRegex.test(email)) {
      alert("mail de l'entreprise obligatoire, SVP!");
    } else {
    this.auth.loginUser(email, password).pipe(
      switchMap(() => this.auth.loginUser(email, password)),
      tap(() => {
        this.router.navigate(['/postList']);
      }),
      catchError(error => {
        this.errorMsg = error.message;
        return EMPTY;
      })
    ).subscribe();
    }
  }
}
