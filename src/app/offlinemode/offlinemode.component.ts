import { Component } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { SkyModalService, SkyModalCloseArgs } from '@blackbaud/skyux/dist/core';
import { OfflineModeContext } from './offlinemode.context';
import { OfflineModeModalComponent } from './offlinemodemodal.component';
import * as toolbox from 'sw-toolbox';

@Component({
  selector: 'my-offlinemode',
  templateUrl: './offlinemode.component.html'
})
export class OfflineModeComponent {
  public tasks: FirebaseListObservable<any>;
  public items: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  public nItems: Array<any> = [];
  constructor(
    private af: AngularFire,
    private modal: SkyModalService) {
    toolbox.options.debug = false;
    toolbox.router.post('(.*)', toolbox.networkFirst);
    toolbox.router.get('/offlinemode(.*)', toolbox.networkFirst, {
      debug: false,
      networkTimeoutSeconds: 4,
      cache: {
        name: 'offlinemode-cache-v1',
        maxEntries: 10,
        maxAgeSeconds: 200
      }
    });

    this.tasks = af.database.list('/tasks', { preserveSnapshot: true });
    this.tasks.subscribe(data => {
      this.nItems = [];
      data.forEach((x: any) => {
        this.nItems.push({
          'id': x.key,
          'person': x.val().person,
          'task': x.val().task,
          'description': x.val().description
        });

      });
      this.items.next(this.nItems.reverse());
    });
  }

  public openModal(type: string) {
    let context = new OfflineModeContext();
    let windowMode: any = {
      'defaultModal': {
        'providers': [{ provide: OfflineModeContext, useValue: context }]
      }
    };
    let modalInstance = this.modal.open(OfflineModeModalComponent, windowMode[type]);
    modalInstance.closed.subscribe((result: SkyModalCloseArgs) => {
      console.log('Modal closed with reason: ' + result.reason + ' and data: ' + result.data);
      console.log(result.data.description)
      this.tasks.push({
        'person': result.data.person || '',
        'task': result.data.task || '',
        'description': result.data.description || ''
      });
    });
  }
}
