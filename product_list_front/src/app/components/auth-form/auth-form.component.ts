import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { FormValidationService } from "../../service/form-validation/form-validation.service";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import { AuthService } from "../../service/auth/auth.service";
import { TokenInterface } from "../../interfaces/token";
import { Subject, takeUntil } from "rxjs";
import {HttpClientModule} from "@angular/common/http";

@Component({
  selector: 'app-auth-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, HttpClientModule],
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.scss']
})
export class AuthFormComponent implements OnDestroy {
  public authForm: FormGroup
  private destroy$: Subject<any> = new Subject<any>();
  public submitted = false;
  public isSingIn = false;
  public redirectTo = '';
  public actionText = '';
  public actionLabel = '';
  public linkText = '';

  constructor(
    public formBuilder: FormBuilder,
    private formValidationService: FormValidationService,
    private router: ActivatedRoute,
    private route: Router,
    private authService: AuthService
    ) {
    this.isSingIn = this.router.snapshot.routeConfig?.path === 'login';
    this.redirectTo = this.isSingIn ? '/register' : '/login';
    this.actionText = this.isSingIn ? 'Sign-in' : 'Sign-up';
    this.actionLabel = this.isSingIn ? 'Don’t have an account ?' : 'Already have an account';
    this.linkText = !this.isSingIn ? 'Sign-in' : 'Sign-up';

    this.authForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    })
  }

  public isInvalid(controlName: string): boolean {
    return this.formValidationService.isInvalid(controlName, this.authForm);
  }

  public getErrorMessage(controlName: string): string {
    return this.formValidationService.getErrorMessage(controlName, this.authForm);
  }

  public onSubmit() {
    this.submitted = true;

    if (this.authForm.invalid) {
      return;
    }

    const formData = new FormData()

    formData.append('email', this.authForm.value.email)
    formData.append('password', this.authForm.value.password)

    this.isSingIn ? this.loginUser(formData) : this.registerUser(formData)
  }

  private loginUser(formData: FormData) {
    this.authService.loginUser(formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe((token: TokenInterface) => {
        localStorage.setItem('token', token.token);
        console.log('success login')
        this.route.navigate([''])
      })
  }

  private registerUser(formData: FormData) {
    this.authService.registerUser(formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe((token: TokenInterface) => {
        localStorage.setItem('token', token.token);
        console.log('success register');
        this.route.navigate([''])
      })
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

}
