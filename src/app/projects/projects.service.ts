import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AuthService } from '../shared/auth.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ProjectModel } from './project.model';
import * as toolbox from 'sw-toolbox';

@Injectable()
export class ProjectsService {
    public projects$: BehaviorSubject<Array<ProjectModel>> = new BehaviorSubject(undefined);
    public projects: FirebaseListObservable<Array<firebase.database.DataSnapshot>>;

    constructor(
        private auth: AuthService,
        private db: AngularFireDatabase) {
        this.auth.org$.subscribe(org => this.getprojectsBy(org.id));
        this.tools();
    }

    private tools() {
        // Setup SW Toolbox - verbose.
        toolbox.options.debug = false;
        toolbox.router.post('(.*)', toolbox.fastest);
        toolbox.router.get('/project(.*)', toolbox.fastest, {
            debug: false,
            networkTimeoutSeconds: 4,
            cache: {
                name: 'project-cache-v1',
                maxEntries: 10,
                maxAgeSeconds: 200
            }
        });
    }

    private updateView(projects: Array<ProjectModel>, reverse?: boolean) {
        if (reverse) {
            this.projects$.next(projects.reverse());
        } else {
            this.projects$.next(projects);
        }
    }

    private snapshotToArray(snapshot) {
        // change the DatabaseSnapshot to array of ProjectModel.
        let returnArray: Array<ProjectModel> = [];

        snapshot.forEach((childSnapshot) => {
            let item: ProjectModel = childSnapshot.val();
            item.id = childSnapshot.key;
            returnArray.push(item);
        });
        this.updateView(returnArray, true);

    }
    private getprojectsBy(orgId) {
        if (orgId) {
            // Connect to the database and get a list of projects
            this.projects =
                this.db.list('/organizations/' + orgId + '/projects/', { preserveSnapshot: true });
            // Do not close the connection!
            // Subscribe to the connection and on each push update the user.
            this.projects.subscribe(data => this.snapshotToArray(data));
        }
    }
}
