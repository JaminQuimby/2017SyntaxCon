import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SkyModalService, SkyModalCloseArgs } from '@blackbaud/skyux/dist/core';
import { ProjectModel } from './project.model';
import { Container } from '../shared/database.service';
import { Subject } from 'rxjs';
import { ModalBuilderComponent } from '../shared/form-builder/modal-builder/modal-builder.component';
import { ModalBuilderModel } from '../shared/form-builder/modal-builder/modal-builder.model';

@Component({
  selector: 'uapi-projects',
  templateUrl: './projects.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ProjectComponent {

  @Container(`users/$uid$/projects`)
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
    let windowMode: any = {
      'defaultModal': {
        'providers': [{ provide: ModalBuilderModel, useValue: model }]
      }
    };
    // Make a modal Instance
    this.modal
      .open(ModalBuilderComponent, windowMode['defaultModal'])
      .closed.subscribe((result: SkyModalCloseArgs) => {
        if (result.reason === 'save') {
          const modal = new ProjectModel();
          this.projects.next([{ ...modal, ...result.data }]);
        }
      });
  }
}
