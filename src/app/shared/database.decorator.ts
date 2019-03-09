import { Injector } from '@angular/core';
import { DatabaseService } from './database.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { AppExtrasModule } from '../app-extras.module';
import { AuthService } from './auth/auth.service';
import { Subject, from } from 'rxjs';
import * as _ from 'lodash';
import { SimplePage } from './database.interface';

export function Container(collection: string, docRef?: string): PropertyDecorator {
  return function (target: any, propertyKey: string) {
    let databaseService: DatabaseService;
    // call service from here to delegate logging

    const HOOKS = [
      'ngOnInit',
      'ngOnDestroy'
    ];

    HOOKS.forEach((hook) => {
      databaseService = ngOnInitHook(hook, target, propertyKey, collection, docRef);
      ngOnDestroyHook(hook, target, databaseService);
    });
    return databaseService;
  };

}

function ngOnInitHook(
  hook: string, target: any, propertyKey: string, collection: string, docRef?: string
) {
  let constructor = target.constructor;
  let databaseService: DatabaseService;
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
          //  console.log('attempt an update', nextPage);
        }
      });
    });
    Object.defineProperty(target, propertyKey, {
      configurable: true,
      enumerable: true,
      get: () => {
        return from(storedSubject);
      },
      set: (page) => {
        if (storedPage === page) {
          return;
        }
        storedPage = Array.isArray(page) ? page : [page];
        storedSubject.next(storedPage);
        // console.log('setter init', page);
      }
    });
    // Overwrite hook.
    constructor.prototype[hook] = (...args: Array<any>) => {
      if (collection === undefined) {
        if (selfOnInit) {
          selfOnInit.apply(this, args);
        }
      }
      // console.log('hook', hook);
      databaseService = injectDataService();
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
                if (storedPage === page) {
                  return;
                }
              }
            });
          }
        });
      if (selfOnInit) {
        selfOnInit.apply(this, args);
      }
    };
  }
  return databaseService;
}

function injectDataService() {
  let databaseService: DatabaseService;
  let angularFirestore: AngularFirestore;
  let authService: AuthService;
  angularFirestore = AppExtrasModule.injector.get(AngularFirestore);
  authService = AppExtrasModule.injector.get(AuthService);
  const service = Injector.create([
    {
      provide: DatabaseService, useClass: DatabaseService, deps: [
        AngularFirestore,
        AuthService
      ]
    },
    { provide: AuthService, useFactory: () => authService, deps: [] },
    { provide: AngularFirestore, useFactory: () => angularFirestore, deps: [] }
  ]);
  databaseService = service.get(DatabaseService);
  return databaseService;
}
function ngOnDestroyHook(hook: string, target: any, databaseService: DatabaseService) {
  if (hook === 'ngOnDestroy') {
    let constructor = target.constructor;
    // console.log('hook', hook);
    const selfOnDestory = constructor.prototype[hook];
    if (databaseService) {
      if (typeof selfOnDestory === 'function') {
        selfOnDestory();
      }
      databaseService.database$.unsubscribe();
    }
  }
}
