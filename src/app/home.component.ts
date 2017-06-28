import { Component } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

@Component({
  selector: 'my-home',
  templateUrl: './home.component.html'
})
export class HomeComponent {
  user = {};
  constructor(
    public db: AngularFireDatabase
  ) {
    /*
    this.af.auth.subscribe(user => {
      if(user) {
        // user logged in
        this.user = user;
      }
      else {
        // user not logged in
        this.user = {};
      }
    });
    */
  }

  login() {
    /*
  this.af.auth.login({
    provider: AuthProviders.Google
  });*/
}
 
logout() {/*
  this.af.auth.logout();*/
}
}
