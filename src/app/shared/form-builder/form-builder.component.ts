import { Component, Input, OnInit, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'form-builder',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form (change)="onChange.emit(this.form.value)" [formGroup]="form" class="form-horizontal">
      <div *ngFor="let field of model.fields">
          <field-builder [field]="field" [form]="form"></field-builder>
      </div>
    </form>
  `
})
export class FormBuilderComponent implements OnInit {
  @Output()
  public onChange = new EventEmitter();
  @Input()
  public model: any;
  public form: FormGroup;
  constructor() { }

  public ngOnInit() {
    const model = this.model;
    let fieldsControls: { [key: string]: FormControl | FormGroup } = {};
    for (let f of this.model.fields) {
      if (f.type !== 'checkbox') {
        const name = f.name;
        fieldsControls[name] = new FormControl(model[name] || '', Validators.required);
      } else {
        let opts: { [key: string]: FormControl | FormGroup } = {};
        for (let opt of f.options) {
          opts[opt.key] = new FormControl(opt.value);
        }
        fieldsControls[f.name] = new FormGroup(opts);
      }
    }
    this.form = new FormGroup(fieldsControls);
  }
}
