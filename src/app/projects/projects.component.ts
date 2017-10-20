import { Component } from '@angular/core';
import { SkyModalService, SkyModalCloseArgs } from '@blackbaud/skyux/dist/core';
import { ProjectModel } from './project.model';
import { ProjectFormComponent } from './project-form.component';
import { ProjectsService } from './projects.service';

@Component({
  selector: 'uapi-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['projects.component.scss']
})

export class ProjectComponent {
  constructor(
    private service: ProjectsService,
    private modal: SkyModalService) { }

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
          this.service.save(Object.assign(new ProjectModel(), result.data));
        }
      });
  }
}
