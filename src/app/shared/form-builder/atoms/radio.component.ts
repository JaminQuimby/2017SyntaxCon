import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'radio-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
      <sky-radio-group [formGroup]="form">
        <sky-radio *ngFor="let opt of field.options" [value]="opt.key">
          <sky-radio-label>{{opt.label}}</sky-radio-label>
        </sky-radio>
      </sky-radio-group>
    `
})
export class RadioComponent {
  @Input()
  public field: any = {};
  @Input()
  public form: FormGroup;
}
