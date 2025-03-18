import { Component, Signal, computed, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  isRegisterMode = signal<boolean>(false); // Toggle between Login & Register
  loginError = signal<string>('');
  successMessage = signal<string>('');

  loginForm = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6)],
    }),
  });

  email: Signal<FormControl<string>> = computed(
    () => this.loginForm.controls.email
  );
  password: Signal<FormControl<string>> = computed(
    () => this.loginForm.controls.password
  );

  toggleMode() {
    this.isRegisterMode.set(!this.isRegisterMode());
    this.loginError.set('');
    this.successMessage.set('');
    this.loginForm.reset();
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      if (this.isRegisterMode()) {
        this.registerUser(email!, password!);
      } else {
        this.authenticateUser(email!, password!);
      }
    }
  }

  registerUser(email: string, password: string) {
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');

    if (storedUsers.some((user: any) => user.email === email)) {
      this.loginError.set('❌ User already exists.');
      return;
    }

    storedUsers.push({ email, password });
    localStorage.setItem('users', JSON.stringify(storedUsers));

    this.successMessage.set('✅ Registration successful! Please log in.');
    this.isRegisterMode.set(false);
  }

  authenticateUser(email: string, password: string) {
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');

    const user = storedUsers.find(
      (user: any) => user.email === email && user.password === password
    );

    if (user) {
      this.successMessage.set('✅ Login successful!');
      this.loginError.set('');
    } else {
      this.loginError.set('❌ Invalid email or password.');
    }
  }
}
