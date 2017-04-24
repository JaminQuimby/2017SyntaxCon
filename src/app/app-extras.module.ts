import { NgModule } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { OfflineModeModalComponent } from './offlinemode/offlinemodemodal.component';

import { SkyAppBootstrapper } from '@blackbaud/skyux-builder/runtime/bootstrapper';

(SkyAppBootstrapper as any).processBootstrapConfig = () => {
  return new Promise((resolve, reject) => {
    reject(

      window.location.replace("http://jaminquimby.com");

    //resolve(true)
  });
};

const firebaseConfig = {
  apiKey: 'AIzaSyAiHb8ByUNWBdeKZWIZyUapBMxSggLiJIg',
  authDomain: 'otg2017-f4d23.firebaseapp.com',
  databaseURL: 'https://otg2017-f4d23.firebaseio.com',
  projectId: 'otg2017-f4d23',
  storageBucket: 'otg2017-f4d23.appspot.com',
  messagingSenderId: '131069844360'
};
// Specify entry components, module-level providers, etc. here.
@NgModule({
  imports: [
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  providers: [],
  entryComponents: [
    OfflineModeModalComponent
  ]
})
export class AppExtrasModule { }
