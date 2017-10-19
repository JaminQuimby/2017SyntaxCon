import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { OrganizationModel } from './organization.model';

@Injectable()
export class AuthService {
  private user: Observable<firebase.User>;
  public user$: BehaviorSubject<any> = new BehaviorSubject({});
  public org$: BehaviorSubject<any> = new BehaviorSubject({});

  public orgCollection: AngularFirestoreCollection<any>;

  constructor(
    private firebaseAuth: AngularFireAuth,
    private db: AngularFirestore
  ) {
    firebase.firestore().enablePersistence()
      .then(function () {
        // Initialize Cloud Firestore through firebase
        let db = firebase.firestore();
      })
      .catch(function (err) {
        if (err.code === 'failed-precondition') {
          console.log(err.code);
        } else if (err.code === 'unimplemented') {
          console.log(err.code);
        }
      });
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
    this.orgCollection = this.db.collection('/users/' + userUid + '/organization');
    // does not contain ids //  this.tasks$ = this.tasksCollection.valueChanges();

    this.orgCollection.snapshotChanges().map(actions => {
      return actions.map(action => {
        const data = action.payload.doc.data() as OrganizationModel;
        const id = action.payload.doc.id;
        return { id, ...data };
      });
    }).subscribe(org => { this.org$.next(org[0]); });
  }
}
