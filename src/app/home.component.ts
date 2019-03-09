import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AuthService } from './shared/auth/auth.service';
import { ProfileService } from './shared/profile/profile.service';
import { UserModel } from './shared/user/user.model';

@Component({
  selector: 'my-home',
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class HomeComponent {
  public model: UserModel;

  constructor(
    private auth: AuthService,
    public profile: ProfileService
  ) {
    this.profile.user$.subscribe((user: UserModel) => {
      this.model = user;
    });
  }

  public login() {
    this.auth.login_google();

  }

  public logout() {
    this.auth.logout();
  }

}
