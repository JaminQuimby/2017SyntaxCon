import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'field-builder',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <div [formGroup]="form">
    <label class="sky-control-label"
    [attr.for]="field.label"
    [ngClass]="{'sky-control-label-required' : field.required}">{{field.label}}</label>
    <div class="col-md-9" [ngSwitch]="field.type">
      <text-box *ngSwitchCase="'text'" [field]="field" [form]="form"></text-box>
      <drop-down *ngSwitchCase="'dropdown'" [field]="field" [form]="form"></drop-down>
      <check-box *ngSwitchCase="'checkbox'" [field]="field" [form]="form"></check-box>
      <radio-button *ngSwitchCase="'radio'" [field]="field" [form]="form"></radio-button>
      <file-box *ngSwitchCase="'file'" [field]="field" [form]="form"></file-box>
      <div class="alert alert-danger my-1 p-2 fadeInDown animated" *ngIf="!isValid && isDirty">{{field.label}} is required</div>
    </div>
  </div>
  `
})
export class FieldBuilderComponent implements OnInit {
  @Input()
  public field: any;
  @Input()
  public form: any;

  get isValid() { return this.form.controls[this.field.name].valid; }
  get isDirty() { return this.form.controls[this.field.name].dirty; }

  constructor() { }

  public ngOnInit() {
  }

}
