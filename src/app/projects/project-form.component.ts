import { Component } from '@angular/core';
import { SkyModalInstance } from '@blackbaud/skyux/dist/core';
import { ProjectModel } from './project.model';

@Component({
  selector: 'project-form-modal',
  templateUrl: './project-form.component.html'
})

export class ProjectFormComponent {

  constructor(
    public model: ProjectModel,
    public instance: SkyModalInstance) { }

}
