import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AuthService } from '../shared/auth.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { TaskModel } from './task.model';
import * as toolbox from 'sw-toolbox';

@Injectable()
export class TasksService {
    public task$: BehaviorSubject<Array<TaskModel>> = new BehaviorSubject(undefined);
    public taskCollection: AngularFirestoreCollection<TaskModel>;

    constructor(
        private auth: AuthService,
        private db: AngularFirestore) {
        this.auth.org$.subscribe(org => this.getTaskBy(org.id));
        this.tools();
    }

    private tools() {
        // Setup SW Toolbox - verbose.
        toolbox.options.debug = false;
        toolbox.router.post('(.*)', toolbox.fastest);
        toolbox.router.get('/tasks(.*)', toolbox.fastest, {
            debug: false,
            networkTimeoutSeconds: 4,
            cache: {
                name: 'tasks-cache-v1',
                maxEntries: 10,
                maxAgeSeconds: 200
            }
        });
    }

    private updateView(task: Array<TaskModel>, reverse?: boolean) {
        if (reverse) {
            this.task$.next(task.reverse());
        } else {
            this.task$.next(task);
        }
    }
    
    private getTaskBy(orgId: string) {
        if (orgId) {
            // Connect to the database and get a list of task
            this.taskCollection =
                this.db.collection<TaskModel>('/organizations/' + orgId + '/tasks/');
                this.taskCollection.snapshotChanges().map(actions => {
                    return actions.map(action => {
                        const data = action.payload.doc.data() as TaskModel;
                        const id = action.payload.doc.id;
                        return { id, ...data };
                    });
                }).subscribe(data => { this.updateView(data, true); });
        }
    }
}
