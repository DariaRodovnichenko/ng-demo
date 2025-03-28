import { Component, Signal, computed, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { FirestoreService } from '../../services/firestore.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  isRegisterMode = signal<boolean>(false);
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

  constructor(
    private authService: AuthService,
    private firestoreService: FirestoreService
  ) {}

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
    this.authService
      .register(email, password)
      .then((userCredential) => {
        const { uid, email } = userCredential.user;

        // ✅ Save user info to Firestore
        this.firestoreService
          .saveData('users', {
            uid,
            email,
            createdAt: new Date(),
          })
          .then(() => {
            this.successMessage.set(
              '✅ Registration successful! Please log in.'
            );
            this.loginError.set('');
            this.isRegisterMode.set(false);
            this.loginForm.reset();
          })
          .catch((firestoreError) => {
            console.error('Firestore Error:', firestoreError);
            this.loginError.set(
              `⚠️ Registration succeeded but failed to save user data: ${firestoreError.message}`
            );
          });
      })
      .catch((authError) => {
        console.error('Auth Error:', authError);
        this.loginError.set(`❌ ${authError.message}`);
      });
  }

  authenticateUser(email: string, password: string) {
    this.authService
      .login(email, password)
      .then(() => {
        this.successMessage.set('✅ Login successful!');
        this.loginError.set('');
      })
      .catch((error) => {
        console.error(error);
        this.loginError.set(`❌ ${error.message}`);
      });
  }
}
