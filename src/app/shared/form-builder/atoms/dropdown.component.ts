import { Component, Input, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DatabaseService } from '../../database.service';
import { Observable, from, of } from 'rxjs';
import { SimplePage } from '../../database.interface';
@Component({
  selector: 'drop-down',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
      <div [formGroup]="form">
        <select class="sky-form-group sky-form-control"
          [compareWith]="compareById"
          [id]="field.name"
          [formControlName]="field.name">
          <option *ngFor="let opt of options | async" [ngValue]="{'id':opt.id,'name':opt.name}">{{opt.name}}</option>
        </select>
      </div>
      `
})

export class DropDownComponent implements OnInit {
  @Input()
  public field: any = {};
  @Input()
  public form: FormGroup;
  public utilities: any;
  public options: Observable<Array<SimplePage>>;
  constructor(protected db: DatabaseService) { }

  public async ngOnInit() {
    this.options = from([]);
    if (this.field.container && this.field.options === undefined) {
      this.db.openContainer(this.field.container);
      this.options = from(this.db.database);
    } else {
      this.options = of(this.field.options);
    }
  }

  public compareById(option1: any, option2: any) {
    if (option1 === undefined || option2 === undefined) {
      return false;
    }
    return option1.id === option2.id;
  }
}
