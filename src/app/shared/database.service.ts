import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { SimplePage } from './database.interface';

import { AuthService } from './auth/auth.service';
import { ReplaySubject, Observable, from } from 'rxjs';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  public databasesCollection: AngularFirestoreCollection<any>;
  public databaseDocument: AngularFirestoreDocument<any>;
  public databasesDocument: AngularFirestoreDocument<{}>;
  public database$: ReplaySubject<Array<SimplePage>> = new ReplaySubject(1);
  private collection: string;
  private docRef: string;
  constructor(private db: AngularFirestore, private auth: AuthService) { }

  public async openContainer(collection: string, docRef?: string) {

    // console.log('openContainer', collection, docRef);
    this.auth.user$.subscribe((user) => {
      if (user) {
        collection = collection && collection.replace('users/', `users/${user.uid}/`);
        docRef = docRef && docRef.replace('users/', `users/${user.uid}/`);
        this.collection = collection;
        this.docRef = docRef;
        if (this.collection) {

          this.databasesCollection = this.db.collection(`/${this.collection}/`);
          if (this.docRef) {
            this.databaseDocument = this.databasesCollection.doc(this.docRef);
            this.databaseDocument.snapshotChanges()
              .map(this.documentSnapshotToDomainObject)
              .subscribe((data: SimplePage) => (data.id && this.updateView([data])));
          } else {
            this.databasesCollection.snapshotChanges()
              .map(actions => actions.map(this.documentToDomainObject))
              .subscribe((data) => (data.length > 0 && this.updateView(data)));
          }

        }
      }
    });

  }

  public get database() {
    return from(this.database$);
  }

  public save({ id, ...params }: any) {
    let mutated = this.mutations(params);
    if (id) {
      const page: SimplePage = { 'id': id, ...mutated };
      Object.keys(mutated).length !== 0 ? this.update(page) : this.remove(id);
    } else {
      this.add(mutated);
    }

  }
  private add(page: SimplePage) {
    this.databasesCollection.add(page);
  }

  private remove(id: string) {
    this.databasesCollection.doc(id).delete();
  }

  private update({ id, ...params }: SimplePage) {
    this.databasesCollection.doc(id).update(params);
  }

  private documentToDomainObject = (simplePage: SimplePage): SimplePage => {
    const page = simplePage.payload.doc.data();
    const id = simplePage.payload.doc.id;
    return { id, ...page };
  }
  private documentSnapshotToDomainObject = (simplePage: SimplePage): SimplePage => {
    const page = simplePage.payload.data();
    const id = simplePage.payload.id;
    return { id, ...page };
  }

  private mutations(database: Array<SimplePage>) {
    return database;
  }

  private updateView(database: Array<SimplePage>) {
    this.database$.next(database.reverse());
  }

}
