import { Component } from '@angular/core';
import { ProfileService } from '../shared/profile/profile.service';

@Component({
  selector: 'app-nav',
  templateUrl: './app-nav.component.html',
  styleUrls: ['app-nav.component.scss']
})

export class AppNavComponent {
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
  constructor(public profile: ProfileService) { }

}
