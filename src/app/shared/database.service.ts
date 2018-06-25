import { Injectable, Inject } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AuthService } from '../shared/auth/auth.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { OrganizationModel } from '../shared/org/organization.model';

@Injectable()
export class DatabasesService {
  public databasesCollection: AngularFirestoreCollection<any>;
  public database$: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  private db: AngularFirestore;
  @Inject(AuthService)
  private auth: AuthService;

  constructor(private url: string) { }

  public start() {
    this.auth.org$.subscribe((org: OrganizationModel) => {
      let collectionUrl = `/organizations/${org.id}/${this.url}/`;
      this.databasesCollection = this.db.collection(collectionUrl);
      this.databasesCollection
        .snapshotChanges().map(actions => {
          return actions.map(action => {
            const data = action.payload.doc.data();
            const id = action.payload.doc.id;
            return { id, ...data };
          });
        }).subscribe((data) => {
          if (data.length > 0) {
            this.updateView(data);
          }
        });
    });
  }
  public database() {
    return this.database$;
  }
  public save(database: any) {
    let mutated = this.extend(this.mutations(database));
    mutated.id ?
      this.databasesCollection.doc(mutated.id).update(mutated) :
      this.databasesCollection.add(mutated);
  }

  public remove(id: string) {
    this.databasesCollection.doc(id).delete();
  }

  public update(id: string, ...data: any[]) {
    let change: any = this.database$.getValue().find(database => database.id === id);
    let changes: any = this.extend(change, data);
    this.save(changes);
  }

  private extend(base: any, ...data: any[]) {
    let object = Object.assign({}, base);
    data.forEach((item) => {
      Object.assign(object, item);
    });
    return object;
  }

  private mutations(database: any) {
    let tags: Array<string> = [];
    if (database.tags) {
      database.tags.toString().split(',')
        .forEach((tag: any) => {
          tags.push(tag);
        });
    }
    database.tags = tags;
    return database;
  }
  private updateView(database: Array<any>) {
    this.database$.next(database.reverse());
  }
}
