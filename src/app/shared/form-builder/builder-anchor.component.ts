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
  public model: any;

  constructor(private modal: SkyModalService) { }

  public get columns() {
    return this.model._fields.filter((field) => {
      return field.type !== 'hidden';
    });
  }
  // Skyux Modal with a form inside.
  public openModal(row: any) {
    let model = this.model;
    if (row) { model = { ...this.model, ...row }; }
    const windowMode = { 'providers': [{ provide: ModalBuilderModel, useValue: model }] };
    // Make a modal Instance
    this.modal
      .open(ModalBuilderComponent, windowMode)
      .closed.subscribe((result: SkyModalCloseArgs) => {
        if (result.reason === 'save') {
          delete result.data._fields;
          this.data.next([{ ...result.data }]);
        }
      });
  }
}
