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

  public _fields: FieldBuilderInterface[];
  public _title: string;
  constructor(
    public model: ModalBuilderModel,
    public instance: SkyModalInstance) {
    this._fields = this.model._fields;
    this._title = this.model._title;

  }

  public updateModel(model: any) {
    this.model = {
      ...this.model,
      ...model
    };
  }
}
