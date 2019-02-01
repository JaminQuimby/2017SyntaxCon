import { Injectable, ReflectiveInjector, SimpleChange } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AppExtrasModule } from '../app-extras.module';
import { AuthService } from './auth/auth.service';
import { ReplaySubject } from 'rxjs';
import * as _ from 'lodash';

export interface SimplePage {
  id?: string;
  [key: string]: any;
}

@Injectable()
export class DatabaseService {
  public databasesCollection: AngularFirestoreCollection<any>;
  public databaseDocument: AngularFirestoreDocument<any>;
  public databasesDocument: AngularFirestoreDocument<{}>;
  public database$: ReplaySubject<Array<SimplePage>> = new ReplaySubject(1);
  private uid: string;
  private collection: string;
  private docRef: string;
  constructor(private db: AngularFirestore, private auth: AuthService) {

  }

  public async bootstrap(collection: string, docRef?: string) {
    console.log('bootstrapping', docRef);
    this.auth.user$.subscribe((user) => {
      if (user) {
        collection = collection && collection.replace('$uid$', user.uid);
        docRef = docRef && docRef.replace('$uid$', user.uid);
        this.uid = user.uid;
        this.collection = collection;
        this.docRef = docRef;
        if (this.collection) {

          this.databasesCollection = this.db.collection(`/${this.collection}/`);
          if (this.docRef) {
            this.databaseDocument = this.databasesCollection.doc(this.docRef);
            this.databaseDocument.snapshotChanges()
              .map(this.documentSnapshotToDomainObject)
              .subscribe((data) => (data.id && this.updateView([data])));
          } else {
            this.databasesCollection.snapshotChanges()
              .map(actions => actions.map(this.documentToDomainObject))
              .subscribe((data) => (data.length > 0 && this.updateView(data)));
          }

        }
      }
    });

  }

  public database() {
    return this.database$;
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

  private documentToDomainObject = (_: SimplePage): SimplePage => {
    const page = _.payload.doc.data();
    const id = _.payload.doc.id;
    return { id, ...page };
  }
  private documentSnapshotToDomainObject = (_: SimplePage): SimplePage => {
    const page = _.payload.data();
    const id = _.payload.id;
    return { id, ...page };
  }

  private mutations(database: Array<SimplePage>) {
    return database;
  }

  private updateView(database: Array<SimplePage>) {
    this.database$.next(database.reverse());
  }

}
export function Container(collection: string, docRef?: string): PropertyDecorator {
  return function (target: any, propertyKey: string) {
    // call service from here to delegate logging
    let constructor = target.constructor;
    const HOOKS = [
      'ngOnInit',
      'ngOnDestroy'
    ];
    let databaseService: DatabaseService;
    let angularFirestore: AngularFirestore;
    let authService: AuthService;
    HOOKS.forEach((hook) => {
      if (hook === 'ngOnInit') {
        const selfOnInit = constructor.prototype[hook];
        let storedSubject: ReplaySubject<Array<SimplePage>> = new ReplaySubject(1);
        let storedPage: Array<SimplePage>;

        storedSubject.subscribe((changes) => {

            changes.forEach(newPage => {
              const currentPage: SimplePage = {
                ...storedPage.find((obj: SimplePage) => obj.id === newPage.id)
              };
              if (!_.isEqual(newPage, currentPage)) {
                const nextPage: SimplePage = { ...currentPage, ...newPage };
                databaseService.save(nextPage);
                console.log('attempt an update', nextPage);
              }
            });

        });

        Object.defineProperty(target, propertyKey, {
          configurable: true,
          enumerable: true,
          get: () => {
            return storedSubject;
          },
          set: (page) => {
            if (storedPage === page) { return; }
            storedPage = Array.isArray(page) ? page : [page];
            storedSubject.next(storedPage);
            console.log('setter init', page);
          }
        });

        constructor.prototype[hook] = (...args: Array<any>) => {
          console.log('hook', hook);
          angularFirestore = AppExtrasModule.injector.get(AngularFirestore);
          authService = AppExtrasModule.injector.get(AuthService);
          const service = ReflectiveInjector.resolveAndCreate([
            DatabaseService,
            { provide: AngularFirestore, useFactory: () => angularFirestore },
            { provide: AuthService, useFactory: () => authService }
          ]);
          databaseService = service.get(DatabaseService);
          databaseService.bootstrap(collection, docRef);
          databaseService.database$
            .subscribe((model: SimplePage) => {
              if (model) {
                storedPage = Array.isArray(model) ? model : [model];
                storedSubject.next(storedPage);
                Object.defineProperty(target, propertyKey, {
                  configurable: true,
                  enumerable: true,
                  get: () => {
                    return storedSubject;
                  },
                  set: (page) => {
                    if (storedPage === page) { return; }
                  }
                });
              }
            });
          if (selfOnInit) { selfOnInit.apply(this, args); }
        };
      }
      if (hook === 'ngOnDestroy') {
        console.log('hook', hook);
        const selfOnDestory = constructor.prototype[hook];
        if (databaseService) {
          if (typeof selfOnDestory === 'function') { selfOnDestory(); }
          databaseService.database$.unsubscribe();
        }
      }
    });
    return databaseService;
  };
}
