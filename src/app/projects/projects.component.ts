import { Component } from '@angular/core';
import { SkyModalService, SkyModalCloseArgs } from '@blackbaud/skyux/dist/core';
import { ProjectModel } from './project.model';
import { ProjectFormComponent } from './project-form.component';
import { Container } from '../shared/database.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'uapi-projects',
  templateUrl: './projects.component.html'
})

export class ProjectComponent {

  @Container(`users/$uid$/projects`)
  public projects: Subject<Array<ProjectModel>>;
  constructor(private modal: SkyModalService) { }

  public save(page: ProjectModel) {
    const modal = new ProjectModel();
    this.projects.next([{ ...modal, ...page }]);
  }

  public remove(page: ProjectModel) {
    this.save({ 'id': page.id } as ProjectModel);
  }

  // Skyux Modal with a form inside.
  public openModal(project?: ProjectModel) {
    let model = new ProjectModel();
    if (project) { model = project; }
    let windowMode: any = {
      'defaultModal': {
        'providers': [{ provide: ProjectModel, useValue: model }]
      }
    };
    // Make a modal Instance
    this.modal
      .open(ProjectFormComponent, windowMode['defaultModal'])
      .closed.subscribe((result: SkyModalCloseArgs) => {
        if (result.reason === 'save') {
          const modal = new ProjectModel();
          this.projects.next([{ ...modal, ...result.data }]);
        }
      });
  }
}
