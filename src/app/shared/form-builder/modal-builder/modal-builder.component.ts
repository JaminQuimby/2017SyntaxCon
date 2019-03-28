import { Component, ChangeDetectionStrategy } from '@angular/core';

import {
  SkyModalInstance
} from '@skyux/modals';

import { FieldBuilderInterface } from '../field-builder/field-builder.interface';
import { ModalBuilderModel } from './modal-builder.model';

@Component({
  selector: 'modal-builder',
  templateUrl: './modal-builder.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalBuilderComponent {

  public fields: FieldBuilderInterface[];
  public title: string;
  constructor(
    public model: ModalBuilderModel,
    public instance: SkyModalInstance) {
    this.fields = this.model.fields;
    this.title = this.model.title;

    console.log('model', model);
  }

  public updateModel(model: any) {
    this.model = {
      ...this.model,
      ...model
    };
  }
}
