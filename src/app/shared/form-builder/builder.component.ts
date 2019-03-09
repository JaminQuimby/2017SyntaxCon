import { Component, ComponentFactoryResolver, ViewChild, Input, OnDestroy, ViewContainerRef, OnInit } from '@angular/core';
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

  constructor(private resolver: ComponentFactoryResolver) { }

  public loadComponent() {
    this.currentAnchorIndex = (this.currentAnchorIndex + 1) % this.anchors.length;
    let item = this.anchors[this.currentAnchorIndex];
    let componentFactory = this.resolver.resolveComponentFactory(item.component);
    let viewContainerRef: ViewContainerRef = this.anchorHost.viewContainerRef;
    viewContainerRef.clear();
    let componentRef = viewContainerRef.createComponent(componentFactory);
    (<BuilderAnchorComponent>componentRef.instance).model = item.model;
    (<BuilderAnchorComponent>componentRef.instance).data = item.data;
    item.data.subscribe((s) => { console.log(s); })

  }

  public ngOnInit(): void {
    this.loadComponent();
  }

  public ngOnDestroy(): void {
    clearInterval(this.interval);
  }
}
