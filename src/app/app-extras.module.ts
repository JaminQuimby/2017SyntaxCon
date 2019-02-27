import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFirestoreModule, AngularFirestore } from 'angularfire2/firestore';
import { AngularFireModule } from 'angularfire2';
import { AuthService } from './shared/auth/auth.service';
import { ProjectViewComponent } from './projects/project-view.component';
import { DragulaService, DragulaModule } from 'ng2-dragula/ng2-dragula';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WebStorageModule } from 'ngx-store';
import { NgModule, Injector } from '@angular/core';
import { ProfileService } from './shared/profile/profile.service';
import { ProfileFormComponent } from './shared/profile/profile-form.component';
import { SkyAppBootstrapper } from '@blackbaud/skyux-builder/runtime/bootstrapper';
import { FormBuilderComponent } from './shared/form-builder/form-builder.component';
import { ModalBuilderComponent } from './shared/form-builder/modal-builder/modal-builder.component';
import { DatabaseService } from './shared/database.service';
import { BuilderAnchorComponent } from './shared/form-builder/builder-anchor.component';
import { BuilderAnchorDirective } from './shared/form-builder/builder-anchor.directive';
import { FirestoreSettingsToken} from '@angular/fire/firestore';

(SkyAppBootstrapper as any).processBootstrapConfig = () => {
  return new Promise((resolve, reject) => {
    //  reject(false);
    resolve(true);

  });
};

const environment = {
  production: false,
  p2p: {
    host: 'otg2017peerserver.herokuapp.com'
  },
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
import {
  AppSkyModule
} from './app-sky.module';

@NgModule({
  imports: [
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    DragulaModule,
    FormsModule,
    ReactiveFormsModule,
    WebStorageModule
  ],
  exports: [
    AppSkyModule, DragulaModule, BuilderAnchorDirective],
  declarations: [
    BuilderAnchorDirective
  ],
  providers: [
    AuthService,
    AngularFireAuth,
    DragulaService,
    ProfileService,
    DatabaseService,
    { provide: FirestoreSettingsToken, useValue: {} }
  ],
  entryComponents: [
    ProjectViewComponent,
    ProfileFormComponent,
    FormBuilderComponent,
    ModalBuilderComponent,
    BuilderAnchorComponent
  ]
})
export class AppExtrasModule {
  public static injector: Injector;
  constructor(private injector: Injector, private db: AngularFirestore) {
    this.db.firestore.enablePersistence();
    AppExtrasModule.injector = this.injector;

  }
}
