import { Component } from '@angular/core';
import { SkyModalService, SkyModalCloseArgs } from '@blackbaud/skyux/dist/core';
import { ProjectModel } from './project.model';
import { ProjectFormComponent } from './project-form.component';
import { Container } from '../shared/database.service';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'uapi-projects',
  templateUrl: './projects.component.html'
})

export class ProjectComponent {
  @Container(`users/$uid$/projects`)
  private projects: Subject<ProjectModel[]>;
  constructor(private modal: SkyModalService) {
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
        console.log(this.projects, 'close');
        const modal = new ProjectModel();
        if (result.reason === 'save') {
          this.projects = { ...modal, ...result.data };
        }
      });
  }
}
