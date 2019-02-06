import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup } from '@angular/forms';

// text,email,tel,textarea,password,
@Component({
  selector: 'text-box',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
      <div [formGroup]="form">
        <input *ngIf="!field.multiline"
        [attr.type]="field.type" class="sky-form-control"
        [id]="field.name"
        [name]="field.name"
        [formControlName]="field.name">
        <textarea *ngIf="field.multiline" [class.is-invalid]="isDirty && !isValid" [formControlName]="field.name" [id]="field.name"
        rows="9" class="sky-form-control" [placeholder]="field.placeholder"></textarea>
      </div>
    `
})

export class TextBoxComponent {
  @Input()
  public field: any = {};
  @Input()
  public form: FormGroup;
  get isValid() { return this.form.controls[this.field.name].valid; }
  get isDirty() { return this.form.controls[this.field.name].dirty; }

  constructor() {

  }
}
