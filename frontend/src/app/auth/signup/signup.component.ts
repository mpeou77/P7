import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, EMPTY, switchMap, tap } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  errorMsg!: string;
  textRegex!: RegExp;

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.textRegex = /^[a-zA-Zéè\-_\s]{1,20}$/;
    this.signupForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required],
      lastname: [null,[Validators.required, Validators.pattern(this.textRegex)]],
      firstname: [null,[Validators.required, Validators.pattern(this.textRegex)]]
    });
  }

  onSignup() {
    const email = this.signupForm.get('email')!.value;
    const password = this.signupForm.get('password')!.value;
    const lastname = this.signupForm.get('lastname')!.value;
    const firstname = this.signupForm.get('firstname')!.value;
    this.auth
      .createUser(email, password, lastname, firstname)
      .pipe(
        switchMap(() => this.auth.loginUser(email, password)),
        tap(() => {
          this.router.navigate(['/postList']);
        }),
        catchError((error) => {
          this.errorMsg = error.message;
          return EMPTY;
        })
      )
      .subscribe();
  }
}
