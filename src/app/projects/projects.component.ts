import { BuilderAnchorComponent } from '../shared/form-builder/builder-anchor.component';
import { BuilderAnchorItem } from '../shared/form-builder/builder-anchor.items';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Container } from '../shared/database.decorator';
import { ProjectModel, projectFields } from './project.model';
import { Subject } from 'rxjs';

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
    const pageConfig = { 'title': 'Project' };
    let dataModel: ProjectModel = new ProjectModel();
    dataModel.fields = projectFields;
    const anchor = new BuilderAnchorItem(BuilderAnchorComponent, dataModel, this.projects, pageConfig);
    this.anchors.push(anchor);
  }
}
