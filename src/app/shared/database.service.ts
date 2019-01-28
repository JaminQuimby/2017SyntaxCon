import { Injectable, ReflectiveInjector } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AppExtrasModule } from '../app-extras.module';
import { AuthService } from './auth/auth.service';
import { ReplaySubject } from 'rxjs';

@Injectable()
export class DatabaseService {
  public databasesCollection: AngularFirestoreCollection<any>;
  public databaseDocument: AngularFirestoreDocument<any>;
  public databasesDocument: AngularFirestoreDocument<{}>;
  public database$: ReplaySubject<Array<any>> = new ReplaySubject(1);
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
  public save(database: any) {
    let mutated = this.mutations(database);
    mutated.id ?
      this.databasesCollection.doc(mutated.id).update(mutated) :
      this.databasesCollection.add(mutated);
  }

  public remove(id: string) {
    this.databasesCollection.doc(id).delete();
  }

  public update(id: string, ...data: any[]) {
    let change: any = this.database$.subscribe(database => database.find(db => db.id === id));
    let changes: any = { ...change, ...data };
    this.save(changes);
  }

  private documentToDomainObject = (_: any) => {
    console.log('doc2domain', _);
    const data = _.payload.doc.data();
    const id = _.payload.doc.id;
    return { id, ...data };
  }
  private documentSnapshotToDomainObject = (_: any) => {
    console.log('snap2domain', _);
    const data = _.payload.data();
    const id = _.payload.id;
    return { id, ...data };
  }

  private mutations(database: any) {
    return database;
  }

  private updateView(database: Array<any>) {
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
        console.log('hiddenOnInitHookFire', hook);
        const selfOnInit = constructor.prototype[hook];
        let storedSubject: ReplaySubject<Array<any>> = new ReplaySubject(1);
        let storedModel: Array<any>;

        Object.defineProperty(target, propertyKey, {
          configurable: true,
          enumerable: true,
          get: () => {
            return storedSubject;
          },
          set: (newData) => {
            storedModel = Array.isArray(newData) ? newData : [newData];
            storedSubject.next(storedModel);
            console.log('setter init', newData);
            if (storedModel.length === 1) {
              // Used to save first page in the container...
              // Replace with a init page?
              databaseService.save(newData);
            }
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
            .subscribe((model: any) => {
              console.log('model', model);
              if (model) {

                storedModel = Array.isArray(model) ? model : [model];
                storedSubject.next(storedModel);
                console.log('distinct change', model, storedModel, storedSubject);
                Object.defineProperty(target, propertyKey, {
                  configurable: true,
                  enumerable: true,
                  get: () => {
                    return storedSubject;
                  },
                  set: (newData) => {
                    console.log('newData', newData);
                    if (storedModel === newData) { return; }
                    databaseService.save(newData);
                    let current: any = [];
                    databaseService.database$
                      .subscribe(database => current = database);

                    const next = { ...current.find((obj: any) => obj.id === newData.id), newData };
                    databaseService.database$.next(next);
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
