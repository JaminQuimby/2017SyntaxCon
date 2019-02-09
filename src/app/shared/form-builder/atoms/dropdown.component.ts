import { Component, Input, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DatabaseService } from '../../database.service';
import { Observable } from 'rxjs';
import { SimplePage } from '../../database.interface';
@Component({
  selector: 'drop-down',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
      <div [formGroup]="form">
        <select class="sky-form-group sky-form-control"
          [id]="field.name"
          [formControlName]="field.name">
          <option *ngFor="let opt of options | async" [ngValue]="opt.id">{{opt.name}}</option>
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
    this.options = Observable.from([]);
    console.log('ngOnInit');
    if (this.field.container && this.field.options === undefined) {
      this.db.openContainer(this.field.container);
      this.options = Observable.from(this.db.database);
    } else {
      this.options = Observable.of(this.field.options);
    }
  }
}
