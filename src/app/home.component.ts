import { Component } from '@angular/core';
import { AuthService } from './shared/auth/auth.service';
import { ProfileService } from './shared/profile/profile.service';

@Component({
  selector: 'my-home',
  templateUrl: './home.component.html'
})

export class HomeComponent {
  public email: string;
  public password: string;

  constructor(
    private auth: AuthService,
    public profile: ProfileService
  ) { }

  public login() {
    this.auth.login();
    this.email = this.password = '';
  }

  public logout() {
    this.auth.logout();
  }

}
