import { NgModule } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';

/*
import { SkyAppBootstrapper } from '@blackbaud/skyux-builder/runtime/bootstrapper';
(SkyAppBootstrapper as any).processBootstrapConfig = () => {
  return new Promise((resolve, reject) => {
  //  reject(false);
    resolve(true);
  });
};
*/
const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyAiHb8ByUNWBdeKZWIZyUapBMxSggLiJIg',
    authDomain: 'otg2017-f4d23.firebaseapp.com',
    databaseURL: 'https://otg2017-f4d23.firebaseio.com',
    projectId: 'otg2017-f4d23',
    storageBucket: 'otg2017-f4d23.appspot.com',
    messagingSenderId: '131069844360'
  }
};
// Specify entry components, module-level providers, etc. here.
@NgModule({
  imports: [
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  providers: [],
  entryComponents: [

  ]
})
export class AppExtrasModule { }
