import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { SkyModalService, SkyModalCloseArgs } from '@blackbaud/skyux/dist/core';
import { ProjectModel } from './project.model';
import { ProjectFormComponent } from './project-form.component';
import { ProjectsService } from './projects.service';

@Component({
  selector: 'uapi-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['projects.component.scss']
})

export class ProjectComponent implements OnInit {

  public projectView: BehaviorSubject<Array<ProjectModel>> = new BehaviorSubject([]);

  constructor(
    private service: ProjectsService,
    private modal: SkyModalService) { }

  public ngOnInit() {
    this.service.projects$.subscribe(projects => {
      if (projects) { this.projectView.next(projects); }
    });

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
    let modalInstance = this.modal.open(ProjectFormComponent, windowMode['defaultModal']);
    modalInstance.closed.subscribe((result: SkyModalCloseArgs) => {
      this.save(Object.assign(new ProjectModel(), result.data));
    });
  }
  protected remove(id: string) {
    this.service.projects.remove(id);
  }
  private save(project: ProjectModel) {
    if (project.id) {
      this.service.projects.update(project.id, project);
    } else {
      this.service.projects.push(project);
    }
  }

}
