import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ProjectModel } from './project.model';
import { Container } from '../shared/database.decorator';
import { Subject } from 'rxjs';
import { BuilderAnchorItem } from '../shared/form-builder/builder-anchor.items';
import { BuilderAnchorComponent } from '../shared/form-builder/builder-anchor.component';

@Component({
  selector: 'uapi-projects',
  template: '<uapi-builder [anchors]="anchors"></uapi-builder>',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ProjectComponent {

  @Container(`users/projects`)
  public projects: Subject<Array<ProjectModel>>;
  public anchors: BuilderAnchorItem[] = [];
  constructor() {

    let model: ProjectModel = new ProjectModel();
    model._fields = [
      {
        type: 'text',
        name: 'name',
        label: 'Project Name',
        required: true
      },
      {
        type: 'text',
        name: 'description',
        label: 'Description'
      },
      {
        type: 'hidden',
        name: 'id'
      }
    ];
    model.title = 'Project';
    this.projects.subscribe((s) => { console.log('projects', s); });

    const anchor = new BuilderAnchorItem(BuilderAnchorComponent, model, this.projects);
    this.anchors.push(anchor);
  }
}
