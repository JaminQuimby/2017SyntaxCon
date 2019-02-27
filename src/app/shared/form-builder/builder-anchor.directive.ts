import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[anchorHost]'
})
export class BuilderAnchorDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
