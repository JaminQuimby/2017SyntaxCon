import { Component, ComponentFactoryResolver, ViewChild, Input, AfterViewInit, OnDestroy, ViewContainerRef } from '@angular/core';
import { BuilderAnchorDirective } from './builder-anchor.directive';
import { BuilderAnchorComponent } from './builder-anchor.component';
import { BuilderAnchorItem } from './builder-anchor.items';
@Component({
  selector: 'uapi-builder',
  template: `<div><ng-template anchorHost></ng-template></div>`
})
export class BuilderComponent implements OnInit, OnDestroy {
  @Input()
  public anchors: BuilderAnchorItem[];
  public currentAnchorIndex = -1;

  @ViewChild(BuilderAnchorDirective)
  public anchorHost: BuilderAnchorDirective;

  public interval: any;

  constructor(private factory: ComponentFactoryResolver) { }

  public loadComponent() {
    console.log(this.anchorHost);
    let model = {
      model: {
        fields: [
          {
            type: 'text',
            name: 'name',
            label: 'Test Name',
            required: true
          },
          {
            type: 'text',
            name: 'description',
            label: 'Test'
          },
          {
            type: 'hidden',
            name: 'id'
          }
        ]
      }
    };

    this.currentAnchorIndex = (this.currentAnchorIndex + 1) % this.anchors.length;
    let item = this.anchors[this.currentAnchorIndex];
    let componentFactory = this.factory.resolveComponentFactory(item.component);
    let viewContainerRef: ViewContainerRef = this.anchorHost.viewContainerRef;
    viewContainerRef.clear();

    let componentRef = viewContainerRef.createComponent(componentFactory);
    (<BuilderAnchorComponent>componentRef.instance).model = model;

  }

  public ngOnInit(): void {
    this.loadComponent();
    console.log(this.anchorHost);
  }
  public ngOnDestroy(): void { clearInterval(this.interval); }
}
