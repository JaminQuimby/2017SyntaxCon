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

    let dataModel: ProjectModel = new ProjectModel();
    dataModel.fields = [
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
    let pageConfig = { 'title': 'Project' };

    const anchor = new BuilderAnchorItem(
      BuilderAnchorComponent,
      dataModel,
      this.projects,
      pageConfig);
    this.anchors.push(anchor);
  }
}
