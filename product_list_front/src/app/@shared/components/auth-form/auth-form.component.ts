import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { FormValidationService } from "../../../@core/services/form-validation/form-validation.service";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { AuthService } from "../../../@core/services/auth/auth.service";
import { IAuthResponse } from "../../../@core/interfaces/token";
import { catchError, Subject, takeUntil, throwError } from "rxjs";
import { HttpClientModule } from "@angular/common/http";
import { User } from "../../../@core/interfaces/user";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-auth-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    HttpClientModule
  ],
  providers: [HttpClientModule],
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.scss']
})
export class AuthFormComponent implements OnDestroy {
  public authForm: FormGroup
  public isSingIn = false;
  public redirectTo = '';
  public actionText = '';
  public actionLabel = '';
  public linkText = '';
  private destroy$ = new Subject();

  constructor(
    public formBuilder: FormBuilder,
    private formValidationService: FormValidationService,
    private router: ActivatedRoute,
    private route: Router,
    private authService: AuthService,
    private toastr: ToastrService
    ) {
    this.isSingIn = this.router.snapshot.routeConfig?.path === 'login';
    this.redirectTo = this.isSingIn ? '/register' : '/login';
    this.actionText = this.isSingIn ? 'Sign-in' : 'Sign-up';
    this.actionLabel = this.isSingIn ? 'Don’t have an account ?' : 'Already have an account';
    this.linkText = !this.isSingIn ? 'Sign-in' : 'Sign-up';

    this.authForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    })
  }

  public isInvalid(controlName: string): boolean {
    return this.formValidationService.isInvalid(controlName, this.authForm);
  }

  public getErrorMessage(controlName: string): string {
    return this.formValidationService.getErrorMessage(controlName, this.authForm);
  }

  public onSubmit() {
    if (this.authForm.invalid) {
      return;
    }

    const formData: User = {...this.authForm.value}

    this.isSingIn
      ? this.performUserOperation(formData, 'loginUser')
      : this.performUserOperation(formData, 'registerUser')
  }

  private performUserOperation(user: User, operation: 'loginUser' | 'registerUser') {
    this.authService[operation](user)
      .pipe(
        catchError((err, caught) => {
          this.toastr.error(err.error.error);
          return throwError(err.error);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((response: IAuthResponse) => {
        localStorage.setItem('token', response.token);
        this.toastr.success(response.message);
        this.route.navigate(['']);
      });
  }

  ngOnDestroy() {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
