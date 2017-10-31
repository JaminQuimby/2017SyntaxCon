import { Component } from '@angular/core';
import { AuthService } from '../shared/auth/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './app-nav.component.html',
  styleUrls: ['app-nav.component.scss']
})

export class AppNavComponent {
  public userPhoto: string;
  public userName: string;
  public nav = [
    {
      name: 'Home',
      path: '/'
    },
     {
      name: 'Dashboard',
      path: '/dashboard'
    },
    {
      name: 'Projects',
      path: '/projects'
    },
    {
      name: 'Task List',
      path: '/tasks'
    }
  ];
  constructor(private auth: AuthService) {
    this.auth.user$.subscribe(user => {
      this.userPhoto = user.photoURL;
      this.userName = user.displayName;
    });
  }

}
