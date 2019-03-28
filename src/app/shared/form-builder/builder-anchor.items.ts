import { Type } from '@angular/core';
import { Subject } from 'rxjs';

export class BuilderAnchorItem {
  constructor(
    public component: Type<any>,
    public dataModel: any,
    public data: Subject<Array<any>>,
    public pageConfig: any
  ) { }
}
