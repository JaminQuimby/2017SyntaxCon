import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SkyModalService, SkyModalCloseArgs } from '@blackbaud/skyux/dist/core';
import { ProjectModel } from './project.model';
import { Container } from '../shared/database.decorator';
import { Subject } from 'rxjs';
import { ModalBuilderComponent } from '../shared/form-builder/modal-builder/modal-builder.component';
import { ModalBuilderModel } from '../shared/form-builder/modal-builder/modal-builder.model';

@Component({
  selector: 'uapi-projects',
  templateUrl: './projects.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ProjectComponent {

  @Container(`users/projects`)
  public projects: Subject<Array<ProjectModel>>;
  constructor(private modal: SkyModalService) { }

  // Skyux Modal with a form inside.
  public openModal(project?: ProjectModel) {
    let model: ProjectModel = new ProjectModel();
    model.fields = [
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
    if (project) { model = { ...model, ...project }; }
    const windowMode = { 'providers': [{ provide: ModalBuilderModel, useValue: model }] };
    // Make a modal Instance
    this.modal
      .open(ModalBuilderComponent, windowMode)
      .closed.subscribe((result: SkyModalCloseArgs) => {
        if (result.reason === 'save') {
          this.projects.next([{ ...new ProjectModel(), ...result.data }]);
        }
      });
  }
}
