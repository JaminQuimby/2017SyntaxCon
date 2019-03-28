import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

import {
  SkyModalCloseArgs,
  SkyModalService
} from '@skyux/modals';

// import { Container } from '../database.decorator';
import { Subject } from 'rxjs';
import { ModalBuilderComponent } from '../form-builder/modal-builder/modal-builder.component';
import { ModalBuilderModel } from '../form-builder/modal-builder/modal-builder.model';

@Component({
  selector: 'uapi-builder-anchor',
  templateUrl: './builder-anchor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class BuilderAnchorComponent {
  @Input()
  public data: Subject<Array<any>>;
  @Input()
  public dataModel: any;
  @Input()
  public pageConfig: any;

  constructor(private modal: SkyModalService) { }

  public get title() {
    return this.pageConfig.title;
  }
  public get columns() {
    return this.dataModel.fields.filter((field: any) => {
      return field.type !== 'hidden';
    });
  }
  // Skyux Modal with a form inside.
  public openModal(row: any) {
    let modalConfig = this.dataModel;
    let pageConfig = this.pageConfig;
    if (row) { modalConfig = { ...this.dataModel, ...row }; }
    const windowMode = {
      'providers': [{
        provide: ModalBuilderModel, useValue: {
          ...modalConfig,
          ...pageConfig
        }
      }]
    };
    // Make a modal Instance
    this.modal
      .open(ModalBuilderComponent, windowMode)
      .closed.subscribe((result: SkyModalCloseArgs) => {
        if (result.reason === 'save') {
          delete result.data.fields;
          this.data.next([{ ...result.data }]);
        }
      });
  }

  public complexObject(testObject: any) {
    if (testObject) {
      // console.log('test', testObject);
      return testObject.hasOwnProperty('name');
    } else {
      return '';
    }
  }

  public remove(row: any) {
    this.data.next([{ 'id': row.id }]);
  }
}
