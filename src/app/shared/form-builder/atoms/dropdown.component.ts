import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'drop-down',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
      <div [formGroup]="form">
        <select class="sky-form-group sky-form-control"
          [id]="field.name"
          [formControlName]="field.name">
          <option *ngFor="let opt of field.options" [value]="opt.key">{{opt.label}}</option>
        </select>
      </div>
      `
})
export class DropDownComponent {
  @Input()
  public field: any = {};
  @Input()
  public form: FormGroup;

  constructor() {

  }
}
