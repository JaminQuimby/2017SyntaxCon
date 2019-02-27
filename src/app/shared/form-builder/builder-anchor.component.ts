import { Component, ChangeDetectionStrategy, ComponentFactoryResolver, Input } from '@angular/core';

import {
  SkyModalCloseArgs,
  SkyModalService
} from '@skyux/modals';

import { Container } from '../database.decorator';
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
  public model: Subject<Array<any>>;

  constructor(private modal: SkyModalService, private factory: ComponentFactoryResolver) {
    console.log('anchor');
  }

  // Skyux Modal with a form inside.
  public openModal(anchor?: any) {
    let model: any;
    model.fields = [
      {
        type: 'text',
        name: 'name',
        label: 'builder-anchor Name',
        required: true
      },
      {
        type: 'text',
        name: 'description',
        label: 'Description'
      },
      {
        type: 'hidden',
        name: 'id'
      }
    ];
    model.title = 'builder-anchor';
    if (anchor) { model = { ...model, ...anchor }; }
    const windowMode = { 'providers': [{ provide: ModalBuilderModel, useValue: model }] };
    // Make a modal Instance
    this.modal
      .open(ModalBuilderComponent, windowMode)
      .closed.subscribe((result: SkyModalCloseArgs) => {
        if (result.reason === 'save') {
          this.model.next([{ ...result.data }]);
        }
      });
  }
}
