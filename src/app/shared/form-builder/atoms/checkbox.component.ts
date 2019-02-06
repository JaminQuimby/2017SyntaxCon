import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'check-box',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
      <div [formGroup]="form">
        <div [formGroupName]="field.name" >
        <sky-checkbox
        *ngFor="let opt of field.options"
        [formControlName]="opt.key"
        >
        <sky-checkbox-label>
        {{opt.label}}
        </sky-checkbox-label>
      </sky-checkbox>

        </div>
      </div>
    `
})
export class CheckBoxComponent {
  @Input()
  public field: any = {};
  @Input()
  public form: FormGroup;
  get isValid() { return this.form.controls[this.field.name].valid; }
  get isDirty() { return this.form.controls[this.field.name].dirty; }
}

/*
        <!-- <div *ngFor="let opt of field.options" class="form-check form-check">
          <label class="form-check-label">
            <input [formControlName]="opt.key" class="form-check-input" type="checkbox" id="inlineCheckbox1" value="option1" />
            {{opt.label}}</label>
          </div> -->

*/
