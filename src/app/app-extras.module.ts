import { NgModule } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { TasklistFormComponent } from './tasklist/tasklist-form.component';
import { ProjectFormComponent } from './projects/project-form.component';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthService } from './shared/auth.service';
import { DragulaService, DragulaModule } from 'ng2-dragula/ng2-dragula';
import { ProjectViewComponent } from './projects/project-view.component';
import { ProjectsService } from './projects/projects.service';
import { DashboardProjectViewComponent } from './dashboard/dashboard-project-view.component';
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
@NgModule({
    imports: [
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireDatabaseModule,
        DragulaModule
    ],
    exports: [DragulaModule],
    providers: [AuthService, AngularFireAuth, DragulaService, ProjectsService],
    entryComponents: [
        TasklistFormComponent,
        ProjectFormComponent,
        ProjectViewComponent,
        DashboardProjectViewComponent
    ]
})
export class AppExtrasModule { }
