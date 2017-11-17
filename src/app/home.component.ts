import { Component } from '@angular/core';
import { AuthService } from './shared/auth/auth.service';
import { ProfileService } from './shared/profile/profile.service';
import { UserModel } from './shared/user/user.model';

@Component({
  selector: 'my-home',
  templateUrl: './home.component.html'
})

export class HomeComponent {
  public email: string;
  public password: string;
  public model: UserModel;

  constructor(
    private auth: AuthService,
    public profile: ProfileService
  ) {
    this.profile.user$.subscribe((user) => {
      this.model = user;
    });
  }

  public login() {
    this.auth.login();
    this.email = this.password = '';
  }

  public logout() {
    this.auth.logout();
  }

}
