import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Messages } from '../../../core/constants/messages.constants';
import { AuthService } from '../../../core/services/auth/auth.service';
import { AddUserMutationVariables } from '../../../core/services/auth/auth.generated';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  // 🛡️ LEVEL 1: Strongly Typed Forms ensure we never send malformed data to GraphQL!
  registerForm = new FormGroup({
    username: new FormControl('', { 
      nonNullable: true, 
      validators: [Validators.required, Validators.minLength(3)] 
    }),
    email: new FormControl('', { 
      nonNullable: true, 
      validators: [Validators.required, Validators.email] 
    }),
    password: new FormControl('', { 
      nonNullable: true, 
      validators: [Validators.required, Validators.minLength(6)] 
    }),
  });

  isLoading = signal(false);
  error = signal<string | null>(null);

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading.set(true);
      this.error.set(null);

      // No more "as any" casting! The types flow perfectly from Form to Service.
      const variables: AddUserMutationVariables = this.registerForm.getRawValue();

      this.authService.register(variables).subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.error.set(err.message || Messages.Auth.RegistrationFailed);
        },
      });
    }
  }

  // Helper for UI validation feedback
  isInvalid(controlName: keyof typeof this.registerForm.controls): boolean {
    const control = this.registerForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}
