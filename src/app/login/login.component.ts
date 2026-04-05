import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    if (!this.username || !this.password) {
      this.error = 'Please enter username and password';
      return;
    }

    this.auth.login(this.username, this.password).subscribe({
      next: () => {
        this.error = '';
        this.router.navigate(['/appointments']);
      },
      error: () => {
        this.error = 'Invalid credentials';
      }
    });
  }
}
