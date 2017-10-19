import { Component } from '@angular/core';
import { AuthService } from './shared/auth.service';

@Component({
  selector: 'my-home',
  templateUrl: './home.component.html'
})

export class HomeComponent {
  public email: string;
  public password: string;
  public user: any;

  constructor(
    private authService: AuthService
  ) {

    this.authService.user$.subscribe(
      user => { this.user = user; }
    );
  }

  public login() {
    this.authService.login();
    this.email = this.password = '';
  }

  public logout() {
    this.authService.logout();
  }

}
