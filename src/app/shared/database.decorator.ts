import { ReflectiveInjector } from '@angular/core';
import { DatabaseService } from './database.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { AppExtrasModule } from '../app-extras.module';
import { AuthService } from './auth/auth.service';
import { Subject, Observable } from 'rxjs';
import * as _ from 'lodash';
import { SimplePage } from './database.interface';

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

      console.log('hook', hook, 'collection', collection);

      if (hook === 'ngOnInit') {
        const selfOnInit = constructor.prototype[hook];
        let storedSubject: Subject<Array<SimplePage>> = new Subject();
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
            return Observable.from(storedSubject);
          },
          set: (page) => {
            if (storedPage === page) { return; }
            storedPage = Array.isArray(page) ? page : [page];
            storedSubject.next(storedPage);
            console.log('setter init', page);
          }
        });
        // Overwrite hook.
        constructor.prototype[hook] = (...args: Array<any>) => {
          if (collection === undefined) { if (selfOnInit) { selfOnInit.apply(this, args); } }
          console.log('hook', hook);
          angularFirestore = AppExtrasModule.injector.get(AngularFirestore);
          authService = AppExtrasModule.injector.get(AuthService);
          const service = ReflectiveInjector.resolveAndCreate([
            DatabaseService,
            { provide: AngularFirestore, useFactory: () => angularFirestore },
            { provide: AuthService, useFactory: () => authService }
          ]);
          databaseService = service.get(DatabaseService);
          databaseService.openContainer(collection, docRef);
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
