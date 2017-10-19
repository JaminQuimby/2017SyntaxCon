import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AuthService } from '../shared/auth.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { TaskModel } from './task.model';
import * as toolbox from 'sw-toolbox';

@Injectable()
export class TasksService {
    public task$: BehaviorSubject<Array<TaskModel>> = new BehaviorSubject(undefined);
    public task: FirebaseListObservable<Array<firebase.database.DataSnapshot>>;

    constructor(
        private auth: AuthService,
        private db: AngularFireDatabase) {
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

    private snapshotToArray(snapshot) {
        // change the DatabaseSnapshot to array of TaskModel.
        let returnArray: Array<TaskModel> = [];

        snapshot.forEach((childSnapshot) => {
            let item: TaskModel = childSnapshot.val();
            item.id = childSnapshot.key;
            returnArray.push(item);
        });
        this.updateView(returnArray, true);

    }
    private getTaskBy(orgId) {
        if (orgId) {
            // Connect to the database and get a list of task
            this.task =
                this.db.list('/organizations/' + orgId + '/tasks/', { preserveSnapshot: true });
            // Do not close the connection!
            // Subscribe to the connection and on each push update the user.
            this.task.subscribe(data => this.snapshotToArray(data));
        }
    }
}
