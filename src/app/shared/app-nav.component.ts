import { Component } from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './app-nav.component.html'
})
export class AppNavComponent {
  public nav = [
    {
      name: 'Home',
      path: '/'
    },
    {
      name: 'Task List',
      path: '/tasklist'
    },
    {
      name: 'Peer Chat',
      path: '/peerchat'
    }
  ];
}
