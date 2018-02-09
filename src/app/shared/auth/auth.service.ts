import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { OrganizationModel } from '../org/organization.model';
import { UserModel } from '../user/user.model';

@Injectable()
export class AuthService {
  private user: Observable<firebase.User>;
  public user$: BehaviorSubject<any> = new BehaviorSubject([]);
  public org$: BehaviorSubject<any> = new BehaviorSubject([]);

  public orgCollection: AngularFirestoreCollection<OrganizationModel>;

  constructor(
    private firebaseAuth: AngularFireAuth,
    private db: AngularFirestore
  ) {
    firebase.firestore().enablePersistence()
      .then(function () {
        // Initialize Cloud Firestore through firebase
        firebase.firestore();
      })
      .catch(function (error) {
        if (error.code === 'failed-precondition') {
          console.log(error.code);
        } else if (error.code === 'unimplemented') {
          console.log(error.code);
        }
      });
    this.user = firebaseAuth.authState;
    this.user.subscribe(user => {
      if (user) {
        // Set user as subject
        this.user$.next(user);
        // Set org as subject
        this.loadOrg(user.uid);
      }
    });
  }

  public login() {
    let provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/plus.login');
    this.firebaseAuth.auth.signInWithRedirect(provider)
      .then((result) => console.log('Signin result', result))
      .catch((error) => console.error('Sigin error', error));
  }
  public logout() {
    this.firebaseAuth
      .auth
      .signOut();
    let user: UserModel = new UserModel();
    this.user$.next(user);
    this.org$.next(undefined);
  }

  public lookupUserBy(userUid: string): UserModel {
    let user = this.db.collection(`/users`).doc(userUid).ref;
    user.get().then(function (doc) {
      if (doc.exists) {
        return doc.data();
      } else {
        return undefined;
      }
    }).catch(function (error) {
      console.log('Error getting user:', error);
      return undefined;
    });
    return undefined;
  }

  public lookupOrgBy(userUid: string): UserModel {
    let org = this.db.collection(`/users/${userUid}/organization`).ref;
    org.get().then(function (doc) {
      if (doc) {
        return '';
      } else {
        return undefined;
      }
    });
    return undefined;
  }

  private loadOrg(userUid: string) {
    // database
    this.orgCollection = this.db.collection(`/users/${userUid}/organization`);
    this.orgCollection.snapshotChanges().map(actions => {
      return actions.map(action => {
        const data = action.payload.doc.data() as OrganizationModel;
        const id = action.payload.doc.id;
        return { id, ...data };
      });
    }).subscribe(org => { this.org$.next(org[0]); });
  }

}
