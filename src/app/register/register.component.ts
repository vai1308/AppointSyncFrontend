import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  confirmPassword = '';

  error = '';
  success = '';

  isSubmitting = false;

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    this.error = '';
    this.success = '';

    if (!this.username || !this.email || !this.password || !this.confirmPassword) {
      this.error = 'Please fill all fields.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match.';
      return;
    }

    if (this.password.length < 8) {
      this.error = 'Password should be at least 8 characters.';
      return;
    }

    this.isSubmitting = true;

    this.auth.register(this.username, this.email, this.password).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.success = 'Registration successful. Redirecting to login...';
        this.error = '';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1200);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.error = 'Registration failed. Try a different username or email.';
        this.success = '';
      }
    });
  }
}
