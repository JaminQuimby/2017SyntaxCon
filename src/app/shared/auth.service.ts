import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase } from 'angularfire2/database';
import { OrganizationModel } from './organization.model';

@Injectable()
export class AuthService {
    private user: Observable<firebase.User>;
    public user$: BehaviorSubject<any> = new BehaviorSubject({});
    public org$: BehaviorSubject<any> = new BehaviorSubject({});

    constructor(
        private firebaseAuth: AngularFireAuth,
        private db: AngularFireDatabase
    ) {
        this.user = firebaseAuth.authState;
        this.user.subscribe(user => {
            if (user) {
                // Set user as subject
                this.user$.next(user);
                // Set org as subject
                this.lookupOrgBy(user.uid);
            }
        });
    }

    public login() {
        const provider = new firebase.auth.GoogleAuthProvider();
        this.firebaseAuth.auth.signInWithPopup(provider)
            .then((result) => console.log('Signin result', result))
            .catch((error) => console.error('Sigin error', error));
    }
    public logout() {
        this.firebaseAuth
            .auth
            .signOut();
    }

    private lookupOrgBy(userUid: string) {
        // database
        this.db.list('/users/' + userUid + '/organization', { preserveSnapshot: true })
            .subscribe(list => {
                list.forEach((organization: firebase.database.DataSnapshot) => {
                    const org: OrganizationModel = Object.assign(
                        { 'id': organization.key }, organization.val()
                    );
                    this.org$.next(org);
                });
            });
    }

}
