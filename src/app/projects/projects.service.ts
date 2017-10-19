import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AuthService } from '../shared/auth.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ProjectModel } from './project.model';
import * as toolbox from 'sw-toolbox';

@Injectable()
export class ProjectsService {
    public projectCollection: AngularFirestoreCollection<ProjectModel>;
    public projects$: BehaviorSubject<Array<ProjectModel>> = new BehaviorSubject(undefined);


    constructor(
        private auth: AuthService,
        private db: AngularFirestore) {
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

    private getprojectsBy(orgId: string) {

        if (orgId) {
            // Connect to the database and get a list of projects
            this.projectCollection =
                this.db.collection<ProjectModel>('/organizations/' + orgId + '/projects/');
            // Do not close the connection!
            // Subscribe to the connection and on each push update the user.
            this.projectCollection.snapshotChanges().map(actions => {
                return actions.map(action => {
                    const data = action.payload.doc.data() as ProjectModel;
                    const id = action.payload.doc.id;
                    return { id, ...data };
                });
            }).subscribe(data => { this.updateView(data, true); });

        }
    }
}
