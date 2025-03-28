import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { Auth, signInAnonymously } from '@angular/fire/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(private auth: Auth) {}

  ngOnInit(): void {
    signInAnonymously(this.auth)
      .then((userCredential) => {
        console.log('👤 Anonymous login success:', userCredential.user);
      })
      .catch((error) => {
        console.error('❌ Anonymous login failed:', error.message);
      });
  }
}
