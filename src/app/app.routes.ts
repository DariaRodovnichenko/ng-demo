import { Routes } from '@angular/router';
import { CryptoComponent } from './components/crypto/crypto.component';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
  { path: '', component: CryptoComponent },
  { path: 'login', component: LoginComponent },
];
